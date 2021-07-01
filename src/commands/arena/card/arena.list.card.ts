import { BaseSession } from 'kbotify';
import { Card } from 'kbotify/dist/core/card';
import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';
import { infoModules } from './arena.info.section';

const divider = {
    type: 'divider',
};

export function arenaListCard(
    session: BaseSession,
    arenas: ArenaDoc[]
): Card[] {
    if (!arenas?.length) {
        throw new Error('arenas error!');
    }
    const [first, ...res] = arenas;
    let arenaList: any[] = [...infoModules(first, session.userId)];
    if (res.length) {
        res.forEach((arena) => {
            arenaList = [
                ...arenaList,
                divider,
                ...infoModules(arena, session.userId),
            ];
        });
    }

    const card1 = new Card({
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '房间列表',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: `点击加入获得房间密码。如需更换房间，直接加入新房间即可。`,
                },
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain-text',
                        content: `更新于：${formatTime(
                            new Date()
                        )}, 创建超过一小时的空房间将不显示。`,
                    },
                ],
            },
        ],
    });
    const card2 = new Card({
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: arenaList,
    });
    return [card1, card2];
}
