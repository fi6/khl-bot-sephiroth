import { Card } from 'kbotify/dist/core/card';
import { channels } from '../../../configs';
import arenaConfig from '../../../configs/arena';
import bot from '../../../init/bot_init';
import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';
import { infoModules } from '../card/arena.info.section';
import { arenaTitleCard } from '../card/arena.title.card';

import { arenaGetValid } from './arena.get-valid';

export async function updateArenaTitle(): Promise<any> {
    const arenas = await arenaGetValid();
    const players = arenas.map((arena) => {
        return arena.member.length ? arena.member[0] : arena;
    });
    const card = arenaTitleCard(arenas.length, players);
    bot.API.message.update(arenaConfig.titleCardId, JSON.stringify([card]));
}

function isEqual(ids: string[], newIds: string[]) {
    const newIdsSorted = newIds.sort();
    return (
        ids.length === newIds.length &&
        ids.sort().every((value, index) => {
            return value === newIdsSorted[index];
        })
    );
}

// function _arenaListCard(arenas: ArenaDoc[]): string {
//     const divider = {
//         type: 'divider',
//     };
//     let card2;
//     if (arenas.length) {
//         const [first, ...res] = arenas;
//         let arenaList: any[] = [...infoModules(first)];
//         if (res.length) {
//             res.forEach((arena) => {
//                 arenaList = [...arenaList, divider, ...infoModules(arena)];
//             });
//         }
//         card2 = {
//             type: 'card',
//             theme: 'secondary',
//             size: 'lg',
//             modules: arenaList,
//         };
//     } else {
//         card2 = {
//             type: 'card',
//             theme: 'secondary',
//             size: 'lg',
//             modules: [
//                 {
//                     type: 'section',
//                     text: {
//                         type: 'kmarkdown',
//                         content: '当前没有房间，你可以点击上方按钮进行创建。',
//                     },
//                 },
//             ],
//         };
//     }
//     // console.debug(JSON.stringify(arenaList));
//     const card1 = {
//         type: 'card',
//         theme: 'info',
//         size: 'lg',
//         modules: [
//             {
//                 type: 'header',
//                 text: {
//                     type: 'plain-text',
//                     content: '房间列表',
//                 },
//             },
//             {
//                 type: 'section',
//                 text: {
//                     type: 'kmarkdown',
//                     content: `**点击加入**获得房间密码。`,
//                 },
//             },
//             {
//                 type: 'context',
//                 elements: [
//                     {
//                         type: 'plain-text',
//                         content:
//                             '超过一小时的房间将不显示在房间列表中。' +
//                             ` (更新于${formatTime(new Date())})`,
//                     },
//                 ],
//             },
//         ],
//     };

//     return JSON.stringify([card1, card2]);
// }
