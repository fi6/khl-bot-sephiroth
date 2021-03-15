import { ArenaSession } from 'commands/arena/arena.types';
import { AppCommand, AppFunc, BaseSession, GuildSession } from 'kbotify';
import Arena from 'models/Arena';

class TrainingLeave extends AppCommand {
    trigger = '退出';
    func: AppFunc<BaseSession> = async (s: BaseSession) => {
        if (!(s instanceof GuildSession)) return;
        const session = s as GuildSession;
        let arenas;
        //     if (!msg.mention.user.length) {
        //         arenas = await Arena.find({
        //             'trainingQueue._id': session.userId,
        //         }).exec();
        //         // console.log(arenas);
        //     } else {
        //         arenas = [
        //             await Arena.findById(msg.mention.user[0]).exec(),
        //         ] as typeof data.arenas;
        //     }
        //     if (!arenas) {
        //         return session.replyTemp('没有找到可退出的房间。');
        //     }
        //     try {
        //         data.arenas.forEach(async (a) => {
        //             await Arena.updateOne(
        //                 { _id: a?._id },
        //                 { $pull: { trainingQueue: { _id: session.userId } } }
        //             );
        //         });
        //     } catch (error) {
        //         console.error(error);
        //         return session.sendTemp('出现未知错误', data);
        //     }
        //     let content = '已离开：\n';
        //     for (const a of data.arenas) {
        //         content += `\`${a.nickname}的特训房\`\n`;
        //     }
        //     return session.replyTemp(content, data);
    };
}

export const trainingLeave = new TrainingLeave();
