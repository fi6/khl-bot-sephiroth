import { ArenaDoc } from 'models/Arena';
import { arenaInfoMsg } from './arena.info.msg';

export const arenaListMsg = (arenas: ArenaDoc[]): string => {
    let trainingFlag;
    let content = '当前房间：\n';
    for (const arena of arenas) {
        if (arena.isTraining) {
            trainingFlag = true;
            content += arenaInfoMsg(arena, true);
        } else if (!arena.isTraining && trainingFlag === true) {
            content += '---\n> ' + arenaInfoMsg(arena, true);
            trainingFlag = false;
        } else {
            content += arenaInfoMsg(arena, true);
        }
    }

    return content;
};
