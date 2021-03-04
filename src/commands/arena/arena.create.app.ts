import { AppCommand, AppCommandFunc, BaseSession } from 'kbotify';
import Arena, { ArenaDoc } from 'models/Arena';
import arenaConfig from '../../configs/arena';
import { cardParser } from '../../utils/card-parser';
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

    func: AppCommandFunc<ArenaSession> = async (session: ArenaSession) => {
        const arenaReg = /^\w{5}$/;
        const passReg = /^\d{0,8}$/;
        const args = session.args;

        if (!args.length) {
            // no args found, return menu
            return session.replyCardTemp(cardParser(createStartCard()));
        }

        if (args[0].startsWith('hp')) {
            // no input added
            if (args[0] == 'hp') {
                session.setTextTrigger(
                    /^\w{5} \d{0,8} .+/,
                    120 * 1e3,
                    (msg) => {
                        let parsedArgs = msg.content.split(/ +/);
                        this.func(new BaseSession(this, parsedArgs, msg));
                    }
                );
                return session.sendCardTemp(cardParser(createHelpCard()));
            }
            // already input code password, remark optional
        }

        if (
            !arenaReg.test(args[0]) ||
            !passReg.test(args[1]) ||
            (args[2] && args[2].length > 7)
        ) {
            return session.replyTemp(
                '创建失败，请检查房间号、密码格式，并确认加速/人数文字长度小于8。'
            );
        }

        session.arena = await this.create(session, args);
        updateArenaList(undefined, true);
        // session.arenas = await arenaGetValid();
        return session.sendCardTemp(
            JSON.stringify(createSuccessCard(session.arena!))
        );
    };

    private async create(session: BaseSession, args: string[]) {
        if (args.length < 3) {
            console.error('args length < 3!');
            return;
        }
        const [arenaId, password, arenaInfo] = [
            args[0].toUpperCase(),
            args[1],
            args[2],
        ];
        let remark = '';
        if (args.length === 4 && args[3]) {
            remark = args[3];
        } else {
            remark = '';
        }

        let arena = await Arena.findByIdAndUpdate(
            session.user.id,
            {
                userNick: session.user.username,
                arenaId: arenaId,
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
        if (!arena?.id) {
            arena = await Arena.findById(session.user.id).exec();
        }
        setTimeout(async () => {
            const arena = await Arena.findOne({ arenaId: arenaId }).exec();
            if (!arena) return;
            if (!arenaIsEmpty(arena)) return;
            Arena.findByIdAndDelete(session.user.id).exec();
            session.mention('房间自动关闭了……下次可以试试广播？');
        }, arenaConfig.allowedEmptyTime);
        return arena;
    }
}

export const arenaCreate = new ArenaCreate();
