import AnonArena from '../../../models/AnonArena';
import { SocketCommandInterface } from '../../command.socket';
import { arenaGetValid } from '../shared/arena.get-valid';

class ArenaCreateSocket implements SocketCommandInterface {
    namespace = '/arena';
    event = 'arena:create';
    callback = async (
        id: string,
        args: string[],
        fn: (response: string) => void
    ) => {
        try {
            this.argsChecker(args);
        } catch (error) {
            fn(error.message);
            return;
        }
        const arena = await this.create(id, ...args);
        fn(
            `创建成功，有效期30分钟。其他人可以通过' .找房 '搜索到此房间。\n${arena.toInfoString()}\n广播房间至其他群请查看说明：https://b23.tv/MaohFT`
        );
    };
    argsChecker(args?: string[]) {
        if (!args || !args.length) {
            throw new Error(
                '.建房 房间号 密码 房间信息\n语音房、广播等功能可查看https://b23.tv/MaohFT'
            );
        }
        if (args.length < 3) {
            throw new Error(
                `参数不符合要求……请输入房间号、密码、房间信息，并用空格分开。\n例：5F23C 147 裸连3人萌新对打`
            );
        }
        const arenaReg = /^\w{5}$/;
        const passReg = /^\d{0,8}$/;
        if (!arenaReg.test(args[0]) || !passReg.test(args[1]))
            throw new Error(
                `创建失败，请检查房间号、密码格式\n${args.join(' ')}`
            );
        if (!/\d/.test(args[2]))
            throw new Error(
                `创建失败……${args.join(
                    ' '
                )}\n第三项中需要人数信息，例：5F23C 147 裸连3人萌新对打`
            );
        return;
    }
    create = async (id: string, ...args: string[]) => {
        const [code, password, ...title] = args;
        const expire = new Date();
        expire.setMinutes(expire.getMinutes() + 30);
        const arena = await AnonArena.findByIdAndUpdate(
            id,
            {
                nickname: '',
                code: code.toUpperCase(),
                password: password,
                info: '',
                title: title.join(' '),
                member: [],
                createdAt: new Date(),
                expireAt: expire,
                voice: '',
                invite: '',
                join: false,
                _empty: false,
                _closed: false,
                public: true,
                limit: 0,
            },
            {
                upsert: true,
                setDefaultsOnInsert: true,
                new: true,
            }
        ).exec();
        return arena;
    };
}

export const arenaCreateSocket = new ArenaCreateSocket();
