import { AppCommand, AppFunc, BaseSession, GuildSession } from 'kbotify';
import TrainingArena from '../../models/TrainingArena';
import { trainingCallManager } from './shared/training.call.manager';
import { updateTraininginfo } from './shared/training.update-info';

class TrainingCheckIn extends AppCommand {
    response: 'guild' = 'guild';
    trigger = '签到';
    func: AppFunc<BaseSession> = async (s) => {
        // const session = s as GuildSession;
        // const arena = await TrainingArena.findById(session.args[0]).exec();
        // if (!arena) return session.replyTemp('没有找到对应的房间');
        // // find user
        // const user = arena.queue.find((user) => {
        //     return user._id === session.user.id;
        // });
        // if (!user) return session.replyTemp('你不在该房间的队伍中');

        // // check if user in voice channel

        // trainingCallManager.response(session.user.id);
        // user.state == 2;
        // arena.markModified('queue');
        // updateTraininginfo(arena);
        // return session.replyTemp(
        //     '签到成功！以下是房间信息：\n' +
        //         `${arena.code} ${arena.password} ${arena.connection}`
        // );
    };
}

export const trainingCheckin = new TrainingCheckIn();
