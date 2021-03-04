import { channel } from '../../../configs';
import arenaConfig from '../../../configs/arena';
import bot from '../../../init/bot_init';
import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';
import { arenaInfoModules } from '../card/arena.info.section';

import { arenaGetValid } from './arena.get-valid';

let cardId = arenaConfig.arenaCardId;
let arenaHostIds: string[] = [];

export async function updateArenaList(
    arenas?: ArenaDoc[],
    onCreate: boolean = false
): Promise<any> {
    arenas = arenas ?? (await arenaGetValid());
    const card = _arenaListCard(arenas);
    try {
        if (cardId !== '') bot.API.message.delete(cardId);
    } catch (error) {
        console.debug('error deleting arena card:', error);
    }
    const newArenaHostIds: string[] = arenas.map((arena) => {
        return arena.id;
    });
    if (arenaHostIds === newArenaHostIds)
        return console.debug('no arena change found, not updating.', arenaHostIds);
    const sent = bot.API.message.create(10, channel.arenaBot, card);
    cardId = (await sent).msgId;
    console.debug('card sent at:', cardId);
    arenaHostIds = newArenaHostIds;
    if (onCreate)
        bot.API.message.create(
            9,
            channel.chat,
            `有新的房间！请前往 (chn)${channel.arenaBot}(chn) 查看。`
        );
    return sent;
}

function _arenaListCard(arenas: ArenaDoc[]): string {
    const divider = {
        type: 'divider',
    };
    let card2;
    if (arenas.length) {
        const [first, ...res] = arenas;
        let arenaList: any[] = [...arenaInfoModules(first)];
        if (res.length) {
            res.forEach((arena) => {
                arenaList = [...arenaList, divider, ...arenaInfoModules(arena)];
            });
        }
        card2 = {
            type: 'card',
            theme: 'secondary',
            size: 'lg',
            modules: arenaList,
        };
    } else {
        card2 = {
            type: 'card',
            theme: 'secondary',
            size: 'lg',
            modules: [
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: '当前没有房间，你可以点击上方按钮进行创建。',
                    },
                },
            ],
        };
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
                    content: `房间列表如下，**点击加入获得房间密码**。`,
                },
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain-text',
                        content:
                            '超过一小时的房间将不显示在房间列表中。' +
                            ` (更新于${formatTime(new Date())})`,
                    },
                ],
            },
        ],
    };

    return JSON.stringify([card1, card2]);
}
