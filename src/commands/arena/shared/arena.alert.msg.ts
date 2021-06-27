// import { ArenaSession } from '../arena.types';
// import { infoMsg } from './arena.info.msg';

// export const arenaAlertMsg = (data: ArenaSession): string => {
//     if (!data.arena)
//         throw new Error('AlertMsg Building but no Arena found in data.');

//     const content = ''.concat(
//         `(met)all(met) ${data.arena.nickname}的房间正在招募！`,
//         data.args[0] ? `\n招募留言：${data.args[0]}\n` : '\n',
//         '房间信息：' + `${infoMsg(data.arena, true)}`
//     );

//     return content;
// };
