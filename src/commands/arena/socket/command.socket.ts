import { Socket } from 'socket.io';

export interface SocketCommandInterface {
    namespace: string;
    event: string;
    callback: SocketCommandCallback;
}

export type SocketCommandCallback = (
    data: { id: string; args: string[] },
    fn: (response: string) => void
) => Promise<void>;
