import { SocketCommandInterface } from '../../command.socket';
import { arenaGetValid } from '../shared/arena.get-valid';

class ArenaListSocket implements SocketCommandInterface {
    namespace = '/arena';
    event = 'arena:list';
    callback = async (data: any, fn: (arg: string) => any) => {
        const arenas = await arenaGetValid();
        if (!arenas.length) {
            fn(
                '当前没有房间，你可以前往创建。\n房间bot说明：https://b23.tv/MaohFT'
            );
            return;
        } else {
            let text = '房间列表';
            arenas.forEach((arena) => {
                text += '\n';
                text += arena.toInfoString();
            });
            text += '\n非公开房间需要加入。房间bot说明：https://b23.tv/MaohFT';
            fn(text);
        }
    };
}

export const arenaListSocket = new ArenaListSocket();
