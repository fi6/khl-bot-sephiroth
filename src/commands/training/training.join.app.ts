import { Session } from 'inspector';
import { AppCommand, AppFunc, BaseSession, GuildSession } from 'kbotify';
import TrainingArena, { TrainingArenaDoc } from 'models/TrainingArena';
import { updateTraininginfo } from './shared/training.update-info';

class TrainingJoin extends AppCommand {
    trigger = '排队';

    help = '特训房排队请输入`.房间 排队 @房主`';
    func: AppFunc<BaseSession> = async (s: BaseSession) => {
        const session = await GuildSession.fromSession(s, true);
        if (session.args.length !== 1) return;

        const arena = await TrainingArena.findById(session.args[0]).exec();
        if (!arena) return session.replyTemp('没有找到对应的房间');

        if (arena.queue.length >= 10) {
            return session.mentionTemp('排队人数已满……请等待空位。');
        }

        if (!arena.register) {
            return session.mentionTemp('停止排队啦……请等待下次的教练房');
        }

        //     console.log('queue:', arena.queue);
        //     const next_number = arena.queue.length
        //         ? arena.queue[arena.queue.length - 1].number + 1
        //         : 1;

        //     session.user.grantRole(149474, session.guild.id);
        //     session.mentionTemp(
        //         '请在60秒内输入你的大乱斗游戏内昵称（便于识别即可）'
        //     );
        //     const inputMsg = await session.awaitMessage(/.+/);
        //     session.user.revokeRole(149474, session.guild.id);
        //     if (!inputMsg?.content) {
        //         return session.mentionTemp('输入失败，请重试');
        //     }
    };
    join = async (session: GuildSession, arena: TrainingArenaDoc) => {
        arena.sortQueue();
        const next_number = arena.queue.length
            ? arena.queue[arena.queue.length - 1].number + 1
            : 1;
        arena.queue.push({
            _id: session.user.id,
            nickname: session.user.nickname ?? session.user.username,
            number: next_number,
            time: new Date(),
            state: 0,
        });
        arena.isNew = false;
        arena.markModified('queue');
        await arena.save();
        updateTraininginfo(arena);
        return session.replyTemp(
            ''.concat(
                '成功加入排队：',
                `\`${arena.nickname}的教练房\`\n`,
                '当前排队人数：',
                `${arena.queue.length}/${arena.limit}`,
                '\n房间号、语音频道等信息将在排队到你后显示，请耐心等待。'
            )
        );
    };
}

export const trainingJoin = new TrainingJoin();
