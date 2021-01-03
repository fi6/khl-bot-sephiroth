import { ArenaDoc } from 'models/Arena';
import { BaseData } from '../pipeline-helper';
import { createPipe, Pipe } from '../pipeline-helper';

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

export interface ArenaData extends BaseData {
    arena?: ArenaDoc;
    arenas?: [ArenaDoc];
}

export enum ArenaCommandStatus {
    no_arena = 'NO_ARENA',
    pending = 'PENDING',
    success = 'SUCCESS',
    help = 'HELP',
    feil = 'FAIL',
    error = 'ERROR',
}

export enum ArenaCommandList {
    create = 'create',
    delete = 'delete',
    alert = 'alert',
    find = 'find',
    help = 'help',
}

export const arenaPipe: Pipe<ArenaData> = createPipe();

export {};
