import { SocketCommandInterface } from './command.socket';
import { arenaGetValid } from '../shared/arena.get-valid';

class ArenaListSocket implements SocketCommandInterface {
    namespace = '/arena';
    event = 'arena:list';
    callback = async (
        data: { id: string; args: string[] },
        fn: (response: string) => void
    ) => {
        const [id, args] = [data.id, data.args];
        const arenas = await arenaGetValid();
        if (!arenas.length) {
            fn('当前没有房间，你可以进行创建。\n发送 .帮助 以获取帮助。');
            return;
        } else {
            const headers = [
                '房间列表',
                '全部房间',
                '查询房间',
                '找房功能',
                '房间查询',
            ];
            let text = this.sample(headers);
            let star = false;
            arenas.forEach((arena) => {
                text += '\n';
                text += arena.toInfoString();
                if (!arena.public) star = true;
            });
            const tails = [
                '如需使用帮助，请发送 .帮助',
                '发送 .帮助 以获取帮助',
                '发送 .帮助 可以查看帮助',
                '发送 .建房 可以创建房间',
                '创建房间请发送 .建房',
            ];
            text += '\n';
            text += star
                ? this.sample([
                      '如需查看星号密码请发送 .帮助',
                      '星号密码房间需加入，请发送 .帮助',
                  ])
                : this.sample(tails);
            fn(text);
        }
    };
    sample = (list: Array<string>) => {
        return list[Math.floor(Math.random() * list.length)];
    };
}

export const arenaListSocket = new ArenaListSocket();
