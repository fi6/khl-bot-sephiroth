import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena from 'models/Arena';
import { ArenaSession } from './arena.types';
import { arenaGetValid } from './shared/arena.get-valid';
import { arenaListMsg } from './shared/arena.list.msg';

class ArenaCreate extends AppCommand<ArenaSession> {
    code = 'create';
    trigger = '创建';
    help =
        '如需将房间添加至房间列表（覆盖），请输入：\n`.建房/.开房 房间号 密码 加速/人数 (留言)`\n`.房间 创建 房间号 密码 加速/人数 (留言)`\n例：`.建房 BTPC1 147 帆游自动3人 娱乐房，随便打`\n留言为可选。';
    intro =
        '将房间添加至房间列表，将会覆盖之前创建的房间。\n`.房间 创建 房间号 密码 加速/人数 留言`';
    func: AppCommandFunc<ArenaSession> = async (session: ArenaSession) => {
        const arenaReg = /^\w{5}$/;
        const passReg = /^\d{0,8}$/;
        const args = data.args;
        const msg = data.msg;

        let remark = '';
        if (args.length < 3) {
            // no args found, return menu
            return this.msgSender.reply(this.help, data);
        }

        if (
            !arenaReg.test(args[0]) ||
            !passReg.test(args[1]) ||
            args[2].length > 7
        ) {
            return this.msgSender.reply(
                '创建失败，请检查房间号、密码格式，并确认加速/人数文字长度小于8。',
                data
            );
        }

        const [arenaId, password, arenaInfo] = [
            args[0].toUpperCase(),
            args[1],
            args[2],
        ];

        if (args.length === 4) {
            remark = args[3];
        } else {
            remark = '';
        }

        data.arena = await Arena.findByIdAndUpdate(
            msg.authorId,
            {
                userNick: msg.author.nickname,
                arenaId: arenaId,
                password: password,
                arenaInfo: arenaInfo,
                remark: remark,
                isTraining: false,
                createdAt: new Date(),
            },
            {
                upsert: true,
            }
        ).exec();
        data.arenas = await arenaGetValid();
        return this.msgSender.reply(
            `创建成功！当前的房间列表：\n${arenaListMsg(data.arenas!)}`,
            data
        );
    };
}

export const arenaCreate = new ArenaCreate();
