import { SocketCommandInterface } from '../../command.socket';
import { arenaGetValid } from '../shared/arena.get-valid';

class ArenaListSocket implements SocketCommandInterface {
    namespace = '/arena';
    event = 'arena:list';
    callback = async (
        id: string,
        args: string[],
        fn: (response: string) => void
    ) => {
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
            let text = headers[Math.floor(Math.random() * headers.length)];
            arenas.forEach((arena) => {
                text += '\n';
                text += arena.toInfoString();
            });
            const tails = [
                '如需使用帮助，请发送 .帮助',
                '发送 .帮助以获取帮助',
                '非公开房间需加入，请发送 .帮助',
                '发送 .建房 可以创建房间',
                '创建房间请发送 .建房',
            ];
            text += '\n' + tails[Math.floor(Math.random() * tails.length)];
            fn(text);
        }
    };
}

export const arenaListSocket = new ArenaListSocket();
