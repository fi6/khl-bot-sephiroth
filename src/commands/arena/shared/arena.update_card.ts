import { channel } from '../../../configs';
import arenaConfig from '../../../configs/arena';
import bot from '../../../init/bot_init';
import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';
import { arenaInfoModules } from '../card/arena.info.section';

import { arenaGetValid } from './arena.get-valid';

let cardId = arenaConfig.arenaCardId;

export async function updateArenaCard() {
    const arenas = await arenaGetValid();
    const card = arenaListCard(arenas);

    await bot.API.message.delete(cardId);
    const sent = bot.API.message.create(10, channel.arenaBot, card);
    cardId = (await sent).msgId;
}

function arenaListCard(arenas: ArenaDoc[]): string {
    const divider = {
        type: 'divider',
    };
    if (!arenas?.length) {
        throw new Error('arenas error!');
    }
    const [first, ...res] = arenas;
    let arenaList: any[] = [...arenaInfoModules(first)];
    if (res.length) {
        res.forEach((arena) => {
            arenaList = [...arenaList, divider, ...arenaInfoModules(arena)];
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
                    content: `房间列表如下，**点击加入获得房间密码**。\n你也可以点击右侧按钮创建房间。`,
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
                        content:
                            `更新于：${formatTime(new Date())}\n` +
                            '超过一小时的房间将不显示在房间列表中。',
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
