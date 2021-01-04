import { TextMessage } from 'kaiheila-bot-root/dist/types';
import {
    ArenaCommands,
    ArenaData,
    arenaPipe,
    ArenaResultStatus,
} from './arena-helper';
import {
    createArena,
    findArena,
    alertArena,
    deleteArena,
    helpArena,
} from './arena-exec';
import training from 'commands/training/training';
import { arenaMsgBuilder, sendArenaMsg } from './arena-msg';

async function arena(
    command: string,
    args: string[],
    msg: TextMessage
): Promise<ArenaData> {
    // console.log(command, args, msg);
    const data: ArenaData = {
        command: command,
        commandCode: '',
        args: args,
        msg: msg,
        result_status: ArenaResultStatus.pending,
        result: {},
        generateContent: async () => {
            data.content = await arenaMsgBuilder(data);
            return data;
        },
    };

    let subCommand: string | undefined;
    switch (command) {
        case '开房': // <== .开房
        case '建房':
            data.commandCode = ArenaCommands.create;
            return await arenaPipeWrapper(createArena);
        case '找房':
            data.commandCode = ArenaCommands.find;
            return await arenaPipeWrapper(findArena);
        case '关房':
            data.commandCode = ArenaCommands.delete;
            return await arenaPipeWrapper(deleteArena);
        case '房间':
        default:
            subCommand = args.shift();
            if (subCommand === undefined) {
                subCommand = 'help';
            }
    }
    data.commandCode = subCommand;
    data.args = args;
    switch (subCommand) {
        case '创建':
            data.commandCode = ArenaCommands.create;
            return await arenaPipeWrapper(createArena);
        case '查看':
            data.commandCode = ArenaCommands.find;
            return await arenaPipeWrapper(findArena);
        case '关闭':
            data.commandCode = ArenaCommands.delete;
            return await arenaPipeWrapper(deleteArena);
        case '广播':
            data.commandCode = ArenaCommands.alert;
            return await arenaPipeWrapper(alertArena);
        //以下为特训相关，需做跳转
        case '管理':
        case '排队':
        case '特训':
        case '移除':
        case '退出':
            return await training(subCommand, args, msg);
        default:
            return await arenaPipeWrapper(helpArena);
    }

    //Write a wrapper for arenaPipe, which wraps sendArenaMsg and data inside.

    async function arenaPipeWrapper(
        command: (x: ArenaData) => Promise<ArenaData>
    ): Promise<ArenaData> {
        return await arenaPipe(command, sendArenaMsg)(data);
    }
}

export default arena;
