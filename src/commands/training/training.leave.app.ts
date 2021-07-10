import { ArenaSession } from 'commands/arena/arena.types';
import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify';
import Arena from 'models/Arena';
import configs from '../../configs';
import TrainingArena from '../../models/TrainingArena';
import { queueManager } from './shared/training.queue-manager';

class TrainingLeave extends AppCommand {
    trigger = '退出';
    func: AppFunc<BaseSession> = async (s: BaseSession) => {
        const session = await GuildSession.fromSession(s, true);
        const arena = await TrainingArena.findById(session.args[0]).exec();
        if (!arena)
            return session.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText('没有找到对应的房间'),
            ]);
        try {
            queueManager.kick(arena, session.user.id);
            return session.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText('已退出排队'),
            ]);
        } catch (error) {
            return session.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText(error.message),
            ]);
        }
    };
}

export const trainingLeave = new TrainingLeave();
