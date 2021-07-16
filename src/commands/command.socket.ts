import { Socket } from 'socket.io';

export interface SocketCommandInterface {
    namespace: string;
    event: string;
    callback: (...args: any[]) => Promise<void>;
}
