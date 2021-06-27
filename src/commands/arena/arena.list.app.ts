import { AppCommand, AppFunc, BaseSession } from 'kbotify';
import Arena from 'models/Arena';
import arenaConfig from '../../configs/arena';
import { arenaCreate } from './arena.create.app';
import { ArenaSession } from './arena.types';
import { arenaListCard } from './card/arena.list.card';
import { arenaGetValid } from './shared/arena.get-valid';

class ArenaList extends AppCommand {
    code = 'list';
    trigger = '查看';
    intro = '查看房间';
    help = '';
    func: AppFunc<BaseSession> = async (session: BaseSession) => {
        const arenas = await arenaGetValid();
        if (!arenas || !arenas?.length)
            return session.replyTemp(
                '当前没有房间。如需创建新房间，可点击上方按钮。'
            );
        return session.updateMessageTemp(
            arenaConfig.mainCardId,
            arenaListCard(session, arenas)
        );
    };
}

export const arenaList = new ArenaList();
