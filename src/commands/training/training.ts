import { ArenaData, arenaPipe } from 'commands/arena/arena-helper';
import { sendArenaMsg } from 'commands/arena/arena-msg';
import { TextMessage } from 'kaiheila-bot-root/dist/types';
import {
    manageTraining,
    createTraining,
    helpTraining,
    joinTraining,
    leaveTraining,
    kickTraining,
} from './training-exec';
import { TrainingCommands, TrainingResultStatus } from './training-helper';
import { trainingMsgBuilder } from './training-msg';

async function training(
    subCommand: string,
    args: string[],
    msg: TextMessage
): Promise<ArenaData> {
    const data: ArenaData = {
        command: subCommand,
        commandCode: '',
        args: args as string[],
        msg: msg as TextMessage,
        result_status: TrainingResultStatus.pending,
        result: {},
        generateContent: async () => {
            data.content = await trainingMsgBuilder(data);
            return data;
        },
    };

    switch (subCommand) {
        case '特训': // <== .房间 特训
            data.commandCode = TrainingCommands.create;
            return await arenaPipeWrapper(createTraining);
        case '管理':
            data.commandCode = TrainingCommands.manage;
            return await arenaPipeWrapper(manageTraining);
        case '移除':
            data.commandCode = TrainingCommands.kick;
            return await arenaPipeWrapper(kickTraining);
        case '排队':
            data.commandCode = TrainingCommands.join;
            return await arenaPipeWrapper(joinTraining);
        case '退出':
            data.commandCode = TrainingCommands.leave;
            return await arenaPipeWrapper(leaveTraining);
        default:
            data.commandCode = TrainingCommands.help;
            return await arenaPipeWrapper(helpTraining);
    }

    //Write a wrapper for arenaPipe, which wraps sendArenaMsg and data inside.

    async function arenaPipeWrapper(
        command: (data: ArenaData) => Promise<ArenaData>
    ): Promise<ArenaData> {
        return await arenaPipe(command, sendArenaMsg)(data);
    }
}

export default training;
