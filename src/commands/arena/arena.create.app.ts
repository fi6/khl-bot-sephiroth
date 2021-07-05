import {
    AppCommand,
    AppFunc,
    BaseSession,
    Card,
    GuildSession,
    TextMessage,
} from 'kbotify';
import Arena, { ArenaDoc } from 'models/Arena';
import { Error } from 'mongoose';
import configs, { channels } from '../../configs';
import arenaConfig from '../../configs/arena';
import roles from '../../configs/roles';
import { log } from '../../init/logger';
import { createHelpCard, createSuccessCard } from './card/arena.create.card';
import { arenaGetValid } from './shared/arena.get-valid';
import { arenaIsEmpty } from './shared/arena.is-empty';
import { expireManager } from './shared/arena.expire-manager';
import { updateArenaTitle } from './shared/arena.update-list';
import { voiceChannelManager } from './shared/arena.voice-manager';
// import { arenaListMsg } from './shared/arena.list.msg';

class ArenaCreate extends AppCommand {
    code = 'create';
    trigger = '创建';
    help =
        '如需将房间添加至房间列表（覆盖），请输入：\n`.建房/.开房 房间号 密码 加速/人数 (留言)`\n`.房间 创建 房间号 密码 加速/人数 (留言)`\n例：`.建房 BTPC1 147 帆游自动3人 娱乐房，随便打`\n留言为可选。';
    intro =
        '将房间添加至房间列表，将会覆盖之前创建的房间。\n`.房间 创建 房间号 密码 加速/人数 留言`';

    func: AppFunc<BaseSession> = async (session: BaseSession) => {
        let args = session.args;
        let helpFlag = false;
        try {
            if (!args.length) {
                args = await this.helpCreate(
                    await GuildSession.fromSession(session)
                );
                helpFlag = true;
            } else if (session.msg instanceof TextMessage)
                session.client.API.message.delete(session.msg.msgId);
            this.argsChecker(args);
        } catch (error) {
            const e = error as Error;
            return session.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText(e.message),
            ]);
        }

        const arena = await this.create(
            await GuildSession.fromSession(session, true),
            args
        );

        await session.updateMessageTemp(
            arenaConfig.mainCardId,
            JSON.stringify(createSuccessCard(arena, helpFlag))
        );
        // await session._send(
        //     `你的专属语音房间链接：${arena.invite}\n点击下方按钮即可加入，也可以分享链接给群友一起聊天～\n(如需参加邀请活动，请在左侧频道列表生成自己的邀请链接)`,
        //     undefined,
        //     {
        //         msgType: 1,
        //         temp: true,
        //     }
        // );
        updateArenaTitle();
        return;
    };

    private argsChecker(args?: string[]) {
        if (!args || args.length < 3) {
            throw new Error(
                `参数不符合要求……请检查参数个数，并确认已用空格正确分开。\n${args}`
            );
        }
        const arenaReg = /^\w{5}$/;
        const passReg = /^\d{0,8}$/;
        if (
            !arenaReg.test(args[0]) ||
            !passReg.test(args[1]) ||
            (args[2] && args[2].length > 7)
        )
            throw new Error(
                `创建失败，请检查房间号、密码格式，并确认加速/人数文字长度小于8。\n${args}`
            );
        if (!/\d/.test(args[2]))
            throw new Error(`创建失败，房间信息中需包含人数信息\n${args}`);
        return;
    }

    async helpCreate(session: GuildSession) {
        const arena = await Arena.findById(session.user.id).exec();
        await session.user.grantRole(roles.tempInput);
        if (session.channel.id == channels.arenaBot) {
            await session.updateMessageTemp(
                arenaConfig.mainCardId,
                createHelpCard(arena).toString()
            );
        } else {
            await session.sendCardTemp(createHelpCard(arena));
        }
        const input = await session.awaitMessage(/.+/, 120 * 1e3);
        session.user.revokeRole(roles.tempInput);
        if (!input) throw new Error('没有收到输入……请重新开始。');
        session.client.API.message.delete(input.msgId);
        let args = input.content.split(/ +/);
        if (args.length > 4) args = [...args.splice(0, 3), args.join(' ')];
        if (!arena) return args;
        return [
            ...args,
            ...[arena.code, arena.password, arena.info, arena.title].splice(
                args.length
            ),
        ];
    }

    private async create(session: GuildSession, args: string[]) {
        const [arenaCode, password, info, title] = [...args];
        const nickname = session.user.nickname ?? session.user.username;
        const expire = new Date();
        expire.setMinutes(expire.getMinutes() + 90);
        const channel = await voiceChannelManager.create(session);
        const arena = await Arena.findByIdAndUpdate(
            session.user.id,
            {
                nickname: nickname,
                code: arenaCode.toUpperCase(),
                password: password,
                info: info,
                title: title && title.length ? title : `${nickname}的房间`,
                member: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                expireAt: expire,
                voice: channel.id,
                invite: await channel.getInvite(),
                join: true,
                _empty: true,
                _closed: false,
                limit: /\d/.exec(info)?.length
                    ? parseInt(/\d/.exec(info)![0])
                    : 4,
            },
            {
                upsert: true,
                new: true,
            }
        ).exec();

        setTimeout(async () => {
            this.checkEmpty(session);
        }, arenaConfig.allowedEmptyTime);
        expireManager.setJobs(arena);
        return arena as ArenaDoc;
    }
    checkEmpty = async (session: BaseSession) => {
        const arena = await Arena.findById(session.user.id).exec();
        if (!arena || !arena._empty || arena._closed) return;
        if (!(await voiceChannelManager.isChannelEmpty(arena.voice))) return;
        log.info('closing arena due to empty 10min', arena);
        // Arena.findByIdAndUpdate(session.user.id, {
        //     expireAt: new Date(),
        // }).exec();
        // updateArenaTitle();
        // voiceChannelManager.recycle(arena.voice);
        expireManager.expire(arena.id, false);
        session.mentionTemp(
            '房间中似乎没有人，自动关闭了……\n下次可以分享邀请小伙伴加入房间哦～'
        );
    };
    // remindExpire = async (session: BaseSession) => {
    //     const arena = await Arena.findOne({ _id: session.user.id }).exec();
    //     if (!arena) return;
    //     log.info('reminding user for arena expire');
    //     session.mentionTemp(
    //         '你的房间已满1小时……\n如果没有延长有效期，则不会在房间列表中继续显示哦～\n语音房间将在1天后回收，下次创建时会新建语音房间。'
    //     );
    // };
}

export const arenaCreate = new ArenaCreate();
