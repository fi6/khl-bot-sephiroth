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
            let text = '房间列表';
            arenas.forEach((arena) => {
                text += '\n';
                text += arena.toInfoString();
            });
            text += '\n星号密码需加入才能查看。\n发送 .帮助 以获取帮助。';
            fn(text);
        }
    };
}

export const arenaListSocket = new ArenaListSocket();
