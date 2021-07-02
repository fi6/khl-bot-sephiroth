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
        this.cache = new LRUCache({ maxAge: 90 * 6e4 });
    }

    getCurrent(arena: ArenaDoc, cancel = false): Jobs {
        const current = this.cache.get(arena.id) ?? {};
        if (cancel) {
            if (current.expireReminder || current.expire) {
                log.info(
                    'cancelling current jobs ',
                    arena.id,
                    arena.nickname,
                    arena.expireAt
                );
                current.expireReminder?.cancel();
                current.expire?.cancel();
            }
        }
        return current;
    }

    setJobs = (arena: ArenaDoc) => {
        const current = this.getCurrent(arena, true);
        const expireRemind = new Date(arena.expireAt);
        expireRemind.setMinutes(expireRemind.getMinutes() - 15);
        current.expireReminder = scheduleJob(expireRemind, () => {
            log.info('running expire reminder', arena);
            this.remind(arena.id);
        });
        current.expire = scheduleJob(arena.expireAt, () => {
            log.info('running expire', arena);
            try {
                this.expire(arena.id, true);
            } catch (error) {
                log.error(error);
            }
        });
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
            `(met)${arena.id}(met) 你的房间还有15分钟过期……\n如果需要延期，请在过期前点击管理房间-延长有效期。`,
            undefined,
            arena.id
        );
    }

    async expire(arenaId: string, remind = false) {
        const arena = await Arena.findById(arenaId).exec();
        if (!arena || arena._closed) return;
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
                `(met)${arena.id}(met) 你的房间已到有效期，将不显示在房间列表中。语音房间已回收。\n你可以在管理房间界面中延长有效期，或重新创建房间。`,
                undefined,
                arena.id
            );
        }
    }
}

export const expireManager = new ExpireManager();
