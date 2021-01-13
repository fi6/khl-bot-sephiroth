import { ArenaDoc } from 'models/Arena';
import { formatTime } from 'utils/utils';

export const arenaInfoMsg = (arena: ArenaDoc, kmd = false): string => {
    let content;
    content = ''.concat(
        `房主：${arena.userNick}\n`,
        `房间：[${arena.arenaId} ${arena.password}] (${arena.arenaInfo})\n`,
        `留言：${arena.remark} (创建于${formatTime(arena.createdAt)})`
    );
    if (arena.isTraining) {
        content += `\n排队中/房间大小：${arena.trainingQueue.length}/${arena.trainingLimit}人\n`;
    }
    if (kmd) {
        if (arena.isTraining) content = '```plain\n***特训房***\n' + content;
        else content = '```markdown\n' + content;
        content = content + +'```\n';
    }

    return content;
};

// let content = '当前房间：\n';
//                 for (const arena of arenas) {
//                     if (arena.isTraining) {
//                         trainingFlag = true;
//                         content +=
//                             '```plain\n**特训房**\n' +
//                             arenaMsgBlock(arena) +
//                             '```\n';
//                     } else if (!arena.isTraining && trainingFlag === true) {
//                         content +=
//                             '---\n> ' +
//                             '```markdown\n' +
//                             arenaMsgBlock(arena) +
//                             '```\n';
//                         trainingFlag = false;
//                     } else {
//                         content +=
//                             '```markdown\n' +
//                             arenaMsgBlock(arena) +
//                             '```\n';
//                     }
//                 }

// return content;
