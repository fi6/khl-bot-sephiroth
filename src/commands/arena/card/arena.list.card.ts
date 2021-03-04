import { ArenaDoc } from '../../../models/Arena';
import { mentionUser } from '../../../utils/khl';
import { ArenaSession } from '../arena.types';
import { arenaInfoModules } from './arena.info.section';

const divider = {
    type: 'divider',
};

export function arenaListCard(session: ArenaSession): string {
    if (!session.arenas)
        throw new Error('no arena given when using arenalistcard');

    const arenas = session.arenas;
    if (!arenas?.length) {
        console.error('arenas error!', session);
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
    // console.debug(JSON.stringify(arenaList));
    const card1 = {
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
    };
    const card2 = {
        type: 'card',
        theme: 'secondary',
        size: 'lg',
        modules: arenaList,
    };

    return JSON.stringify([card1, card2]);
}
