import { AppCommand, AppFunc, BaseSession, GuildSession } from 'kbotify';
import configs from '../../configs';
import { log } from '../../init/logger';
import TrainingArena from '../../models/TrainingArena';
import { queueManager } from './shared/training.queue-manager';

class TrainingCheckIn extends AppCommand {
    response: 'guild' = 'guild';
    trigger = '签到';
    func: AppFunc<BaseSession> = async (s) => {
        const session = await GuildSession.fromSession(s, true);
        const arena = await TrainingArena.findById(session.args[0]).exec();
        if (!arena) return session.sendTemp('没有找到对应的房间');

        try {
            const user = queueManager.response(arena, session.user.id);
            this.client?.API.message.create(
                9,
                configs.channels.chat,
                `(met)${arena.id}(met) \`${user.nickname}\`已签到`,
                undefined,
                arena.id
            );
            return session._send(
                '签到成功！以下是房间信息：\n' +
                    `${arena.code} ${arena.password} ${arena.info}` +
                    `\n请加入语音频道：${arena.invite}`,
                undefined,
                { msgType: 1, temp: true }
            );
        } catch (error) {
            log.debug('error when response', error);
            return session.sendTemp(error.message);
        }
    };
}

export const trainingCheckin = new TrainingCheckIn();
