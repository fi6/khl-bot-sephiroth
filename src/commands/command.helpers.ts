import { fchown } from 'fs';
import { TextMessage } from 'kaiheila-bot-root/dist/types';
import bot from 'init/bot_init';
import { sendArenaMsg } from './arena/arena-msg';
import { BaseData } from './pipeline-helper';

export interface BaseCommand {
    readonly code: string;
    readonly alias: string[];
    readonly type: CommandTypes;
    readonly exec: (...args: any) => unknown;
}

export interface HelpCommand extends BaseCommand {
    type: CommandTypes.HELP;
    exec: (command: string, args: string[], msg: TextMessage) => ResultTypes;
    readonly help: string;
}

/**
 * Class of menu command.
 * There should be 4 args when initializing the class.
 *
 * @export
 * @class MenuCommand
 * @template T
 */
export class MenuCommand<T extends BaseData> implements BaseCommand {
    code = 'code';
    alias = ['alias'];
    menu = 'menu';
    func = async (
        command: string,
        args: string[],
        msg: TextMessage
    ): Promise<FuncResult<T> | ResultTypes.HELP> => {
        const funcResult: FuncResult<T> = {
            type: ResultTypes.SUCCESS,
        };
        return funcResult;
    };
    constructor(
        init?: Partial<MenuCommand<T>>
        // code: string,
        // alias: string[],
        // menu: string,
        // func: (
        //     command: string,
        //     args: string[],
        //     msg: TextMessage
        // ) => Promise<FuncResult<T>>
    ) {
        Object.assign(this, init);
        // this.code = code;
        // this.alias = alias;
        // this.menu = menu;
        // this.func = func;
    }
    async exec(
        command: string,
        args: string[],
        msg: TextMessage
    ): Promise<ResultTypes> {
        try {
            const result = await this.func(command, args, msg);
            if (!result) throw new Error('No result returned!');

            if (result == ResultTypes.HELP) {
                messageSender(null, msg, this.menu);
                return result;
            } else {
                messageSender(result);
                return result.type;
            }
        } catch (error) {
            console.error(error);
            return ResultTypes.ERROR;
        }
    }
    readonly type = CommandTypes.MENU;
}

/**
 * Class of functional command.
 * There should be 4 args when initializing the class.
 *
 * @export
 * @class FunctionCommand
 * @template T
 */
export class FunctionCommand<T extends BaseData> implements BaseCommand {
    code = 'code';
    alias = ['alias'];
    help = 'help';
    func = async (_data: T): Promise<FuncResult<T> | ResultTypes.HELP> => {
        return ResultTypes.HELP;
    };
    constructor(init?: Partial<FunctionCommand<T>>) {
        Object.assign(this, init);
    }
    async exec(data: T): Promise<ResultTypes> {
        try {
            const result = await this.func(data);
            if (!result) throw new Error('No result returned!');

            if (result == ResultTypes.HELP) {
                messageSender(null, data.msg, this.help);
                return result;
            } else {
                messageSender(result);
                return result.type;
            }
        } catch (error) {
            console.error(error);
            return ResultTypes.ERROR;
        }
    }
    readonly type = CommandTypes.FUNCTION;
}

export async function messageSender<T extends BaseData>(
    result: FuncResult<T> | null,
    inputMsg?: TextMessage,
    inputContent?: string
): Promise<FuncResult<T> | ResultTypes> {
    let msg, content;
    if (!result?.returnData) {
        if (inputMsg && inputContent) {
            msg = inputMsg;
            content = inputContent;
        } else {
            throw new Error();
        }
    } else {
        msg = inputMsg ? inputMsg : result.returnData.msg;

        content = inputContent
            ? inputContent
            : (result.returnData.content as string);
    }
    bot.sendChannelMessage(9, msg.channelId, content, msg.msgId);

    return result ? result.type : ResultTypes.SUCCESS;
}

export enum CommandTypes {
    MENU,
    HELP,
    FUNCTION,
}

export enum ResultTypes {
    PENDING,
    SUCCESS,
    FAIL,
    ERROR,
    HELP,
}

export interface FuncResult<T extends BaseData> {
    type: ResultTypes;
    returnData?: T;
    detail?: unknown;
}

export {};
