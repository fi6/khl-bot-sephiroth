import { ArenaSession } from 'commands/arena/arena.types';
import { TextMessage } from 'kaiheila-bot-root/dist/types';
import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena from 'models/Arena';

class TrainingJoin extends AppCommand<ArenaSession> {
    trigger = '排队';

    help = '特训房排队请输入`.房间 排队 @房主`';
    func: AppCommandFunc<ArenaSession> = async (data: ArenaSession) => {
        const [msg, args] = [data.msg as TextMessage, data.args as string[]];

        if (msg.mention.user.length != 1) {
            this.msgSender.reply(this.help, data);
        }
        data.arena = await Arena.findOne({
            _id: msg.mention.user[0],
            isTraining: true,
        }).exec();
        if (!data.arena)
            return this.msgSender.reply('没有找到对应房间。', data);

        for (const user of data.arena.trainingQueue) {
            if (user._id == msg.authorId) {
                return this.msgSender.reply(
                    '你已经在此房间队伍中。如需换到队尾请先输入`.房间 退出`，退出后重新排队。',
                    data
                );
            }
        }
        console.log('queue:', data.arena.trainingQueue);
        const last_tag = data.arena.trainingQueue.length
            ? data.arena.trainingQueue[data.arena.trainingQueue.length - 1]
                  .tag + 1
            : 1;
        // let last_tag;
        // if (!data.arena.trainingQueue[-1].tag) {
        //     last_tag = 1;
        // } else {
        //     last_tag = data.arena.trainingQueue[-1].tag + 1;
        // }
        data.arena.trainingQueue.push({
            _id: msg.authorId,
            userNick: msg.author.nickname,
            time: new Date(),
            tag: last_tag,
        });
        data.arena.isNew = false;
        data.arena.markModified('trainingQueue');
        await data.arena.save();
        const arena = data.arena;
        return this.msgSender.reply(
            ''.concat(
                '成功加入排队：',
                `\`${arena.userNick}的特训房\`\n`,
                '房间号/密码：',
                `[${arena.arenaId} ${arena.password}] `,
                '当前排队人数：',
                `${arena.trainingQueue.length}/${arena.trainingLimit}`
            ),
            data
        );
    };
}

export const trainingJoin = new TrainingJoin();
