import { AppCommand, AppFunc, BaseSession, GuildSession } from 'kbotify';
import TrainingArena from 'models/TrainingArena';

class TrainingJoin extends AppCommand {
    trigger = '排队';

    help = '特训房排队请输入`.房间 排队 @房主`';
    func: AppFunc<BaseSession> = async (s: BaseSession) => {
        if (!(s instanceof GuildSession)) return;
        const session = s as GuildSession;
        if (!session.args.length) return;

        const arena = await TrainingArena.findById(session.args[0]).exec();
        if (!arena) return session.replyTemp('没有找到对应的房间');

        if (arena.queue.length == arena.limit) {
            return session.mentionTemp('排队人数已满……请等待下次的教练房');
        }
        if (!arena.register) {
            return session.mentionTemp('停止排队啦……请等待下次的教练房');
        }

        for (const user of arena.queue) {
            if (user._id == session.userId) {
                if (user.state == -1) {
                    // return session.replyTemp(
                    //     '你已经参加过教练房啦……不能重复参加哦'
                    // );
                } else
                    return session.replyTemp(
                        '你已经在此房间队伍中。如需换到队尾，请退出后重新排队。'
                    );
            }
        }

        console.log('queue:', arena.queue);
        const next_number = arena.queue.length
            ? arena.queue[arena.queue.length - 1].number + 1
            : 1;

        if (session.args.length == 1) {
            session.mentionTemp(
                '请在60秒内输入你的大乱斗游戏内昵称（便于识别即可）'
            );
            session.setTextTrigger('', 6e4, (msg) => {
                session.args.push(msg.content);
                this.exec(session);
            });
        }

        arena.queue.push({
            _id: session.userId,
            nickname: session.user.nickname,
            gameName: session.args[1],
            number: next_number,
            time: new Date(),
        });

        arena.isNew = false;
        arena.markModified('queue');
        await arena.save();
        return session.replyTemp(
            ''.concat(
                '成功加入排队：',
                `\`${arena.nickname}的教练房\`\n`,
                '房间号/密码：',
                `[${arena.code} ${arena.password}] `,
                '当前排队人数：',
                `${arena.queue.length}/${arena.limit}`
            )
        );
    };
}

export const trainingJoin = new TrainingJoin();
