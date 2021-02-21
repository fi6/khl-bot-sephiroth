import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena from 'models/Arena';
import { arenaCreate } from './arena.create.app';
import { ArenaSession } from './arena.types';
import { arenaListCard } from './card/arena.list.card';
import { arenaGetValid } from './shared/arena.get-valid';

class ArenaList extends AppCommand {
    code = 'list';
    trigger = '查看';
    intro = '查看房间';
    help = '';
    func: AppCommandFunc<ArenaSession> = async (session: ArenaSession) => {
        session.arenas = await arenaGetValid();
        if (!session.arenas || !session.arenas?.length)
            return session.reply('当前没有房间。' + arenaCreate.help);
        return session.replyCard(arenaListCard(session));
    };
}

export const arenaList = new ArenaList();
