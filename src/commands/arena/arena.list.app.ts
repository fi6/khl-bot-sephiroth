import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena from 'models/Arena';
import { arenaCreate } from './arena.create.app';
import { ArenaSession } from './arena.types';
import { arenaGetValid } from './shared/arena.get-valid';
import { arenaListMsg } from './shared/arena.list.msg';

class ArenaList extends AppCommand<ArenaSession> {
    code = 'list';
    trigger = '查看';
    intro = '查看房间';
    help = '';
    func: AppCommandFunc<ArenaSession> = async (data: ArenaSession) => {
        data.arenas = await arenaGetValid();
        if (!data.arenas || !data.arenas?.length)
            return this.msgSender.reply(
                '当前没有房间。' + arenaCreate.help,
                data
            );
        return this.msgSender.send(
            arenaListMsg(data.arenas) +
                '房间一小时内有效，发送`.建房`以创建房间。',
            data
        );
    };
}

export const arenaList = new ArenaList();
