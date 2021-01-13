

export interface trainingMsgCreator {
    create(type: string): Promise<string>;
    join(type: string): Promise<string>;
    leave(type: string): Promise<string>;
    manage(type: string): Promise<string>;
    kick(type: string): Promise<string>;
    help(type: string): Promise<string>;
}

// export const TrainingCommands: CommandEnum<trainingMsgCreator> = {
//     create: 'create',
//     join: 'join',
//     leave: 'leave',
//     manage: 'manage',
//     kick: 'kick',
//     help: 'help',
// };

export enum TrainingResultStatus {
    no_arena = 'NO_ARENA',
    pending = 'PENDING',
    wrong_args = 'WRONG_ARGS',
    wrong_args_num = 'WRONG_ARGS_NUM',
    in_queue = 'IN_QUEUE',
    success = 'SUCCESS',
    help = 'HELP',
    fail = 'FAIL',
    error = 'ERROR',
    banned = 'BANNED',
}
