import { EventEmitter } from 'events';
import LRUCache from 'lru-cache';
import { Card, CardObject, KBotify } from 'kbotify';
import configs from '../../../configs';
import bot from '../../../init/bot_init';
import TrainingArena, { TrainingArenaDoc } from '../../../models/TrainingArena';

import { trainingCallCard } from '../card/training.call.card';
import { updateTraininginfo } from './training.update-info';
import { log } from '../../../init/logger';

class TrainingCallManager extends EventEmitter {
    calledCache = new LRUCache<string, boolean>({ max: 16, maxAge: 330 * 1e3 });
    constructor() {
        super();
    }

    markCalled(userId: string, arenaId: string) {
        this.calledCache.set(userId, false);
        setTimeout(async () => {
            const arena = await TrainingArena.findById(arenaId).exec();
            if (!arena || arena.expired) return;
            const user = arena.queue.find((usr) => usr._id == userId);
            if (user && user.state == 1) {
                this.remindKick(arena, userId);
            }
        }, 3 * 6e4);
    }

    response(arena: TrainingArenaDoc, userId: string) {
        const user = arena.queue.find((p) => p._id === userId && p.state == 1);
        if (!user) throw new Error('没有在房间中找到对应的用户');
        user.state = 2;
        arena.markModified('queue');
        arena.save();
        // this.calledCache.set(userId, true);
        log.debug('user check-in', userId);
        return user;
    }

    callNext = (arena: TrainingArenaDoc) => {
        if (!arena.nextCallableUser) throw new Error('no next user');
        // call user
        this._callUser(arena, arena.nextCallableUser);
        return arena.nextCallableUser;
    };

    _callId = (arena: TrainingArenaDoc, userId: string) => {
        const user = arena.queue.find((usr) => usr._id == userId);
        if (user) {
            this._callUser(arena, user);
            return user;
        }
        throw new Error('no user found');
    };

    _callUser = (
        arena: TrainingArenaDoc,
        user: TrainingArenaDoc['queue'][number]
    ) => {
        if (user.state == 2) throw new Error('玩家已签到，不可以再呼叫');
        user.state = 1;
        arena.markModified('queue');
        arena.save();
        this._remind(user._id, trainingCallCard(arena, user._id), 10);
        queueManager.markCalled(user._id, arena.id);
    };

    kickNext(arena: TrainingArenaDoc) {
        let nextUser;
        arena.sortQueue();
        for (const user of arena.queue) {
            if (user.state && user.state >= 0) {
                nextUser = user;
                break;
            }
        }
        if (!nextUser) throw new Error('no next user');
        this.kick(arena, nextUser?._id);
        return nextUser;
    }

    kick = async (arena: TrainingArenaDoc, userId: string) => {
        const user = arena.queue.find((usr) => {
            return usr._id === userId && usr.state !== -1;
        });
        if (!user) {
            throw new Error('cannot find user');
        }
        arena.queue = arena.queue.filter((item) => item._id !== userId);
        arena.markModified('queue');
        await arena.save();
        try {
            if (!arena.full) this.callNext(arena);
        } catch (error) {
            log.error('error after kick: ', error);
        }
        return user;
    };

    _remind(userId: string, content: CardObject[], type = 10) {
        bot.API.message.create(
            type,
            configs.channels.chat,
            JSON.stringify(content),
        );
        bot.API.message.create(
            type,
            configs.channels.arenaBot,
            JSON.stringify(content),
            undefined,
            userId
        );
    }

    remindKick = async (arena: TrainingArenaDoc, userId: string) => {
        if (this.kick(arena, userId)) {
            this._remind(userId, [
                new Card().addText(
                    `(met)${userId}(met)` +
                        ' 由于没有在规定时间内加入语音频道并签到……你的教练房排队已取消'
                ),
            ]);
            this.callNext(arena);
        }
    };
}

export const queueManager = new TrainingCallManager();
