import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify';
import TrainingArena, { TrainingArenaDoc } from 'models/TrainingArena';
import configs from '../../configs';
import { logger } from '../../init/logger';
import { queueManager } from './shared/training.queue-manager';

class TrainingJoin extends AppCommand {
    trigger = '排队';

    help = '特训房排队请输入`.房间 排队 @房主`';
    func: AppFunc<BaseSession> = async (s: BaseSession) => {
        if (s.args.length != 1) return;
        const session = await GuildSession.fromSession(s, true);

        const arena = await TrainingArena.findById(session.args[0]).exec();
        if (!arena) return session.replyTemp('没有找到对应的房间');

        if (arena.queue.length >= 10) {
            return session.mentionTemp('排队人数已满……请等待空位。');
        }

        if (!arena.join) {
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
        this.join(session, arena);
    };

    join = async (session: GuildSession, arena: TrainingArenaDoc) => {
        const num = arena.lastNumber + 1;
        arena.queue.push({
            _id: session.user.id,
            nickname: session.user.nickname ?? session.user.username,
            number: num,
            time: new Date(),
            state: 0,
        });
        arena.isNew = false;
        arena.markModified('queue');
        await arena.save();
        if (!arena.full && arena.nextCallableUser?._id == session.user.id) {
            logger.debug('arena not full, calling this user');
            queueManager._callId(arena, session.user.id);
            this.client?.API.message.create(
                9,
                configs.channels.chat,
                `\`${
                    session.user.nickname ?? session.user.username
                }\`已加入排队，房间未满，已呼叫`,
                undefined,
                arena.id
            );
            return session.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText(
                    '成功加入排队。\n你已被呼叫，请尽快签到并加入房间，否则需要重新排队。'
                ),
            ]);
        }
        this.client?.API.message.create(
            9,
            configs.channels.chat,
            `\`${
                session.user.nickname ?? session.user.username
            }\`已加入排队，房间已满，等待叫号`,
            undefined,
            arena.id
        );
        return session.updateMessageTemp(configs.arena.mainCardId, [
            new Card().addText(
                ''.concat(
                    '成功加入排队：',
                    `\`${arena.nickname}的教练房\`\n`,
                    '当前/你的号码：',
                    `${arena.currentNumber}/${num}`,
                    '\n房间号、语音频道等信息将在排到你后显示，请耐心等待。'
                )
            ),
        ]);
    };
}

export const trainingJoin = new TrainingJoin();
