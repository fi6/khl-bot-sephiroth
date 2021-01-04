import { ArenaDoc } from 'models/Arena';
import { formatTime } from 'utils/utils';
import { BaseData, CommandEnum, PipeMapper } from '../pipeline-helper';
import { createPipe, Pipe } from '../pipeline-helper';
import { sendArenaMsg } from './arena-msg';

/**
 * Create message for arena commands
 *
 * @interface arenaMsgCreator
 */
export interface arenaMsgCreator {
    create(type: string): Promise<string>;
    find(type: string): Promise<string>;
    delete(type: string): Promise<string>;
    help(type: string): Promise<string>;
    alert(type: string): Promise<string>;
}
/**
 * Arena data in the pipeline. Arena is for single found arena, arenas for multiple(mainly for findArena command)
 *
 * @export
 * @interface ArenaData
 */
export interface ArenaData extends BaseData {
    arena?: ArenaDoc | null;
    arenas?: ArenaDoc[] | null;
    generateContent: () => Promise<ArenaData>;
}

export enum ArenaResultStatus {
    no_arena = 'NO_ARENA',
    pending = 'PENDING',
    success = 'SUCCESS',
    help = 'HELP',
    fail = 'FAIL',
    error = 'ERROR',
    time_limit = 'TIME_LIMIT',
}

export const ArenaCommands: CommandEnum<arenaMsgCreator> = {
    create: 'create',
    delete: 'delete',
    alert: 'alert',
    find: 'find',
    help: 'help',
};

export const arenaPipe: Pipe<ArenaData> = createPipe();

export const arenaMsgBlock = (arena: ArenaDoc):string => {
    let content;
    content = ''.concat(
        `房主：${arena.userNick}\n`,
        `房间：[${arena.arenaId} ${arena.password}] (${arena.arenaInfo})\n`,
        `留言：${arena.remark} (创建于${formatTime(arena.createdAt)})`
    );
    if (arena.isTraining) {
        content += `\n排队中/房间大小：${arena.trainingQueue.length}/${arena.trainingLimit}人\n`;
    }
    return content;
};

export {};
