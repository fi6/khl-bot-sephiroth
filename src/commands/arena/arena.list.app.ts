import { AppCommand, AppFunc, BaseSession } from 'kbotify';
import Arena from 'models/Arena';
import { channels } from '../../configs';
import arenaConfig from '../../configs/arena';
import { arenaCreate } from './arena.create.app';
import { ArenaSession } from './arena.types';
import { arenaListCard } from './card/arena.list.card';
import { arenaGetValid } from './shared/arena.get-valid';
import { updateArenaTitle } from './shared/arena.update-list';

class ArenaList extends AppCommand {
    code = 'list';
    trigger = '查看';
    intro = '查看房间';
    help = '';
    func: AppFunc<BaseSession> = async (session: BaseSession) => {
        const arenas = await arenaGetValid();
        updateArenaTitle(arenas);
        if (session.channel.id == channels.arenaBot) {
            if (!arenas || !arenas?.length)
                return session.updateMessageTemp(
                    arenaConfig.mainCardId,
                    arenaEmptyCard()
                );
            return session.updateMessageTemp(
                arenaConfig.mainCardId,
                JSON.stringify(arenaListCard(session, arenas))
            );
        } else {
            if (!arenas || !arenas?.length)
                return session.sendCardTemp(arenaEmptyCard());
            return session.sendCardTemp(arenaListCard(session, arenas));
        }
    };
}

export const arenaList = new ArenaList();

function arenaEmptyCard() {
    return JSON.stringify([
        {
            type: 'card',
            theme: 'secondary',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '查看房间列表',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: `暂时没有活跃的房间……你可以点击上方按钮创建房间。`,
                    },
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'kmarkdown',
                            content: '你也可以在闲聊频道发送 `.找房` 查看房间',
                        },
                    ],
                },
            ],
        },
    ]);
}
