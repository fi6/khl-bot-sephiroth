import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena from '../../models/Arena';
import { ArenaSession } from './arena.types';

class TrainingLeave extends AppCommand {
    trigger = '退出';
    func: AppCommandFunc<ArenaSession> = async (session: ArenaSession) => {
        if (!session.args.length) return;
        const msg = session.msg;
        if (!msg.mention.user.length) {
            session.arenas = await Arena.find({
                'trainingQueue._id': session.userId,
            }).exec();
            // console.log(arenas);
        } else {
            session.arenas = [
                await Arena.findById(msg.mention.user[0]).exec(),
            ] as typeof session.arenas;
        }
        if (!session.arenas) {
            return session.replyTemp('没有找到可退出的房间。');
        }
        try {
            session.arenas.forEach(async (a) => {
                await Arena.updateOne(
                    { _id: a?._id },
                    { $pull: { trainingQueue: { _id: session.userId } } }
                );
            });
        } catch (error) {
            console.error(error);
            return session.sendTemp('出现未知错误');
        }
        let content = '已离开：\n';
        for (const a of session.arenas) {
            content += `\`${a.userNick}的特训房\`\n`;
        }
        return session.replyTemp(content);
    };
}

export const trainingLeave = new TrainingLeave();
