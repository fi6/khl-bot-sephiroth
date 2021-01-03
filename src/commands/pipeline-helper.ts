/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TextMessage } from 'kaiheila-bot-root/dist/types';

type PipeMapper<T> = (data: T) => Promise<T>;
type PipeReducer<T> = (f: PipeMapper<T>, g: PipeMapper<T>) => PipeMapper<T>;
export type Pipe<T> = (...fns: PipeMapper<T>[]) => PipeMapper<T>;

function createPipe<T>(): Pipe<T> {
    const pipePipe: PipeReducer<T> = (
        f: PipeMapper<T>,
        g: PipeMapper<T>
    ) => async (data: T) => g(await f(data));
    return (...fns: PipeMapper<T>[]): PipeMapper<T> => fns.reduce(pipePipe);
}

interface BaseData {
    command: string;
    args: string[];
    msg: TextMessage;
    content?: string;
    result: {
        status: string;
        details?: unknown;
    };
}

enum BaseCommandStatus {
    'PENDING',
    'SUCCESS',
    'HELP',
    'FAIL',
    'ERROR',
}

export { PipeMapper, BaseData, createPipe, BaseCommandStatus };
