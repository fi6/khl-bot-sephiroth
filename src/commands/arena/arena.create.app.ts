import {
    AppCommand,
    AppFunc,
    BaseSession,
    createSession,
    GuildSession,
    TextMessage,
} from 'kbotify';
import Arena, { ArenaDoc } from 'models/Arena';
import { Error } from 'mongoose';
import { channels } from '../../configs';
import arenaConfig from '../../configs/arena';
import roles from '../../configs/roles';
import { parseCard } from '../../utils/card-parser';
import { ArenaSession } from './arena.types';
import {
    createHelpCard,
    createStartCard,
    createSuccessCard,
} from './card/arena.create.card';
import { arenaGetValid } from './shared/arena.get-valid';
import { arenaIsEmpty } from './shared/arena.is-empty';
import { updateArenaList } from './shared/arena.update-list';
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
                args = await this.helpCreate(GuildSession.fromSession(session));
                helpFlag = true;
            } else if (session.msg instanceof TextMessage)
                session._botInstance.API.message.delete(session.msg.msgId);
            args = this.argsChecker(args);
        } catch (error) {
            const e = error as Error;
            return session.mentionTemp(e.message);
        }
        const arena = await this.create(session, args);
        // updateArenaList(undefined, true);
        // session.arenas = await arenaGetValid();
        return session.sendCardTemp(
            JSON.stringify(createSuccessCard(arena, helpFlag))
        );
    };

    private argsChecker(args?: string[]) {
        if (!args || args.length < 3) {
            throw new Error(
                `参数不符合要求……请检查参数个数，并确认用空格正确分开。\n${args}`
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
        const [arenaCode, password, arenaInfo] = [
            args[0].toUpperCase(),
            args[1],
            args[2],
        ];
        return [arenaCode, password, arenaInfo];
    }

    private async helpCreate(session: GuildSession) {
        await session.user.grantRole(roles.tempInput);
        await session.sendCardTemp(createHelpCard());
        const input = await session.awaitMessage(/.+/, 120 * 1e3);
        session.user.revokeRole(roles.tempInput);
        if (!input) throw new Error('没有收到输入……请重新开始。');
        session._botInstance.API.message.delete(input.msgId);
        return Array(...input.content.split(/ +/));
    }

    private async create(session: BaseSession, args: string[]) {
        const [arenaCode, password, arenaInfo] = [args[0], args[1], args[2]];
        let remark = '';
        if (args.length === 4 && args[3]) {
            remark = args[3];
        } else {
            remark = '';
        }

        const arena = await Arena.findByIdAndUpdate(
            session.user.id,
            {
                nickname: session.user.username,
                code: arenaCode,
                password: password,
                arenaInfo: arenaInfo,
                remark: remark,
                member: [],
                createdAt: new Date(),
            },
            {
                upsert: true,
                new: true,
            }
        ).exec();

        setTimeout(async () => {
            const arena = await Arena.findOne({ code: arenaCode }).exec();
            if (!arena) return;
            if (!arenaIsEmpty(arena)) return;
            Arena.findByIdAndDelete(session.user.id).exec();
            session.mentionTemp('房间自动关闭了……下次可以试试广播？');
        }, arenaConfig.allowedEmptyTime);
        return arena as ArenaDoc;
    }
}

export const arenaCreate = new ArenaCreate();
