import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { arenaCreateSocket } from '../commands/arena/socket/arena.create.socket';
import { arenaListSocket } from '../commands/arena/socket/arena.list.socket';
import { SocketCommandInterface } from '../commands/command.socket';
import { logger } from './logger';

const httpServer = createServer();
export const io = new Server(httpServer, {
    path: '/',
});

export let fiSocket: Socket;

io.of('/arena').on('connection', (socket: Socket) => {
    fiSocket = socket;
});

function addCommand(...commands: SocketCommandInterface[]) {
    commands.forEach((command) => {
        io.of(command.namespace).on('connection', (socket: Socket) => {
            logger.info('arena socket connected', socket);
            socket.on(command.event, command.callback);
        });
    });
}

addCommand(arenaListSocket);
addCommand(arenaCreateSocket);

httpServer.listen(31986);
