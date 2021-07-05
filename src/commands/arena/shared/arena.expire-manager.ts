import LRUCache from 'lru-cache';
import Arena, { ArenaDoc } from '../../../models/Arena';
import schedule, { scheduleJob } from 'node-schedule';
import configs, { channels } from '../../../configs';
import bot from '../../../init/bot_init';
import { voiceChannelManager } from './arena.voice-manager';
import { log } from '../../../init/logger';

interface Jobs {
    expireReminder?: schedule.Job;
    expire?: schedule.Job;
}

class ExpireManager {
    cache: LRUCache<string, Jobs>;
    constructor() {
        this.cache = new LRUCache({ maxAge: 120 * 6e4 });
    }

    getCurrent(arena: ArenaDoc, cancel = false): Jobs {
        const current = this.cache.get(arena.id) ?? {};
        if (cancel) {
            log.info(
                'cancelling current job',
                arena.id,
                arena.nickname,
                arena.expireAt
            );
            if (current.expireReminder || current.expire) {
                log.info('current job exists');
            }
            current.expireReminder?.cancel();
            current.expire?.cancel();
        }
        return current;
    }

    setJobs = (arena: ArenaDoc) => {
        const current = this.getCurrent(arena, true);
        const expireRemind = new Date(arena.expireAt.valueOf() - 15 * 6e4);
        current.expireReminder = scheduleJob(expireRemind, () => {
            log.info('running expire reminder', arena);
            this.remind(arena.id);
        });
        current.expire = scheduleJob(
            new Date(arena.expireAt.valueOf() + 3e4),
            () => {
                log.info('running expire', arena);
                try {
                    this.expire(arena.id, true);
                } catch (error) {
                    log.error(error);
                }
            }
        );
        this.cache.set(arena.id, current);
        log.debug(
            'new jobs set',
            arena.id,
            arena.nickname,
            arena.expireAt,
            current.expireReminder.nextInvocation(),
            current.expire.nextInvocation()
        );
    };

    async remind(arenaId: string) {
        const arena = await Arena.findById(arenaId).exec();
        if (!arena || arena.expired) return;
        bot.API.message.create(
            9,
            channels.chat,
            `(met)${arena.id}(met) 你的房间还有15分钟过期……\n如果需要延期，请点击管理房间-延长有效期。`,
            undefined,
            arena.id
        );
    }

    async expire(arenaId: string, remind = false) {
        const arena = await Arena.findById(arenaId).exec();
        if (!arena || arena._closed || !arena.expired) return;
        if (!voiceChannelManager.isChannelEmpty(arena.voice)) {
            const expire = new Date();
            expire.setMinutes(expire.getMinutes() + 90);
            arena.expireAt = expire;
            arena.save();
            this.setJobs(arena);
            bot.API.message.create(
                9,
                channels.chat,
                `(met)${arena.id}(met) 语音房间中似乎还有人……已为你自动延长1小时。`,
                undefined,
                arena.id
            );
            log.info('arena voice channel not empty, expire += 1h', arena);
            return;
        }
        voiceChannelManager.recycle(arena.voice);
        this.getCurrent(arena, true);
        arena.expireAt = new Date();
        arena._closed = true;
        arena.member = [];
        arena.markModified('member');
        arena.save();
        if (remind) {
            bot.API.message.create(
                9,
                channels.chat,
                `(met)${arena.id}(met) 你的房间已到有效期，将不显示在房间列表中，语音房间已回收。\n你可以在管理房间界面中延长有效期，或重新创建房间。`,
                undefined,
                arena.id
            );
        }
    }
}

export const expireManager = new ExpireManager();
