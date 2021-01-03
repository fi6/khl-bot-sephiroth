import { TextMessage } from 'kaiheila-bot-root/dist/types';
// import trainingCommand from '../training';
import { sendArenaMsg } from './arena-msg';
import { ArenaData, arenaPipe } from './arena-helper';
import { arenaAlert, arenaCreate, arenaDelete, arenaFind } from './arena-exec';

async function arenaCommand(
    command: string,
    args: string[],
    msg: TextMessage
): Promise<ArenaData> {
    // console.log(command, args, msg);
    const data: ArenaData = {
        command: command,
        args: args,
        msg: msg,
        result: { status: '' },
    };
    let subCommand: string | undefined;
    switch (command) {
        case '开房': // <== .开房
        case '建房':
            return await arenaPipe(arenaCreate, sendArenaMsg)(data);
        case '找房':
            return await arenaPipe(arenaFind, sendArenaMsg)(data);
        case '关房':
            return arenaPipe(arenaDelete, sendArenaMsg)(data);
        case '房间':
        default:
            subCommand = args.shift();
            if (subCommand === undefined) {
                subCommand = 'help';
            }
    }
    data.command = subCommand;
    data.args = args;
    switch (subCommand) {
        case '创建':
            return await arenaPipe(arenaCreate, sendArenaMsg)(data);
        case '查看':
            return await arenaPipe(arenaFind, sendArenaMsg)(data);
        case '关闭':
            return await arenaPipe(arenaDelete, sendArenaMsg)(data);
        case '广播':
            return await arenaPipe(arenaAlert, sendArenaMsg)(data);
        //以下为特训相关，需做跳转
        // case '管理':
        // case '排队':
        // case '特训':
        // case '移除':
        // case '退出':
        //     trainingCommand(subCommand, args, msg);
        //     return await arenaPipe(sendArenaMsg)(data);
        //     break;
        default:
            data.command = 'help';
            return await arenaPipe(sendArenaMsg)(data);
    }
}

export default arenaCommand;
