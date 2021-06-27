import { BaseSession } from 'kbotify';
import { Card } from 'kbotify/dist/core/card';
import { ArenaDoc } from '../../../models/Arena';
import { mentionUser } from '../../../utils/khl';
import { ArenaSession } from '../arena.types';
import { arenaInfoModules } from './arena.info.section';

const divider = {
    type: 'divider',
};

export function arenaListCard(session: BaseSession, arenas: ArenaDoc[]): Card {
    if (!arenas?.length) {
        throw new Error('arenas error!');
    }
    const [first, ...res] = arenas;
    let arenaList: any[] = [...arenaInfoModules(first, session.userId)];
    if (res.length) {
        res.forEach((arena) => {
            arenaList = [
                ...arenaList,
                divider,
                ...arenaInfoModules(arena, session.userId),
            ];
        });
    }

    const card2 = new Card({
        type: 'card',
        theme: 'secondary',
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
                    content: `${mentionUser(
                        session.userId
                    )}房间列表如下，点击加入获得房间密码。\n你也可以点击右侧按钮创建房间。`,
                },
                mode: 'right',
                accessory: {
                    type: 'button',
                    theme: 'primary',
                    click: 'return-val',
                    value: '.房间 创建',
                    text: {
                        type: 'plain-text',
                        content: '创建房间',
                    },
                },
            },
            ...arenaList,
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain-text',
                        content: '超过一小时的房间将不显示在房间列表中。',
                    },
                ],
            },
        ],
    });

    return card2;
}
