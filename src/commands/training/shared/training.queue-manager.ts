import { EventEmitter } from 'events';
import LRUCache from 'lru-cache';
import { Card, CardObject, KBotify } from 'kbotify';
import configs from '../../../configs';
import bot from '../../../init/bot_init';
import TrainingArena, { TrainingArenaDoc } from '../../../models/TrainingArena';

import { trainingCallCard } from '../card/training.call.card';
import { updateTraininginfo } from './training.update-info';
import { log } from '../../../init/logger';

const cache = new LRUCache<string, boolean>({ max: 16, maxAge: 330 * 1e3 });

class TrainingCallManager extends EventEmitter {
    client: KBotify;
    constructor(client: KBotify) {
        super();
        this.client = client;
    }

    markCalled(userId: string) {
        cache.set(userId, false);
        setTimeout(() => {
            if (cache.get(userId) === false) {
                cache.del(userId);
            }
        }, 5 * 6e4);
    }

    response(arena: TrainingArenaDoc, userId: string) {
        const user = arena.queue.find((item) => (item._id = userId));
        if (!user) throw new Error('没有在房间中找到对应的用户');
        user.state = 2;
        arena.markModified('queue');
        arena.save();
        cache.set(userId, true);
        log.debug('user check-in', userId);
        return user;
    }

    callNext = (arena: TrainingArenaDoc) => {
        let nextUser;
        arena.sortQueue();
        for (const user of arena.queue) {
            if (user.state == 0) {
                nextUser = user;
                break;
            }
        }
        if (!nextUser) throw new Error('no next user');
        // call user
        this._callUser(arena, nextUser);
        return nextUser;
    };

    _callId = (arena: TrainingArenaDoc, userId: string) => {
        const user = arena.queue.find((usr) => usr._id == userId);
        if (user) this._callUser(arena, user);
        throw new Error('no user found');
    };

    _callUser = (
        arena: TrainingArenaDoc,
        user: TrainingArenaDoc['queue'][number]
    ) => {
        if (user.state == 2) throw new Error('玩家已签到，不可以再呼叫');
        user.state = 1;
        arena.markModified('queue');
        this._remind(user._id, trainingCallCard(arena, user._id), 10);
        queueManager.markCalled(user._id);
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

        this.kick(nextUser?._id, arena);
        return nextUser;
    }

    kick(userId: string, arena: TrainingArenaDoc) {
        const user = arena.queue.find((usr) => {
            return usr._id === userId && usr.state !== -1;
        });
        if (!user) {
            throw new Error('cannot find user');
        }
        arena.queue = arena.queue.filter((item) => item._id !== userId);
        arena.markModified('queue');
        arena.save();
        return user;
    }

    _remind(userId: string, content: CardObject[], type = 9) {
        this.client.API.message.create(
            type,
            configs.channels.chat,
            JSON.stringify(content),
            undefined,
            userId
        );
        this.client?.API.message.create(
            type,
            configs.channels.arenaBot,
            JSON.stringify(content),
            undefined,
            userId
        );
    }
    remindKick = async (arenaId: string, userId: string) => {
        const arena = await TrainingArena.findOne({
            _id: arenaId,
        }).exec();
        if (!arena) return;
        if (this.kick(userId, arena)) {
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

export const queueManager = new TrainingCallManager(bot);
