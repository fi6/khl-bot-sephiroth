import { ArenaData } from 'commands/arena/arena.types';
import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena from 'models/Arena';

class TrainingLeave extends AppCommand<ArenaData> {
    trigger = '退出';
    func: AppCommandFunc<ArenaData> = async (data: ArenaData) => {
        const msg = data.msg;
        if (!msg.mention.user.length) {
            data.arenas = await Arena.find({
                'trainingQueue._id': msg.authorId,
            }).exec();
            // console.log(arenas);
        } else {
            data.arenas = [
                await Arena.findById(msg.mention.user[0]).exec(),
            ] as typeof data.arenas;
        }
        if (!data.arenas) {
            return this.msgSender.reply('没有找到可退出的房间。', data);
        }
        try {
            data.arenas.forEach(async (a) => {
                await Arena.updateOne(
                    { _id: a?._id },
                    { $pull: { trainingQueue: { _id: msg.authorId } } }
                );
            });
        } catch (error) {
            console.error(error);
            return this.msgSender.send('出现未知错误', data);
        }
        let content = '已离开：\n';
        for (const a of data.arenas) {
            content += `\`${a.userNick}的特训房\`\n`;
        }
        return this.msgSender.reply(content, data);
    };
}

export const trainingLeave = new TrainingLeave();
