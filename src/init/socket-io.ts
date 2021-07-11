import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from './logger';

const httpServer = createServer();
const io = new Server(httpServer, {
    // ...
});

io.on('connection', (socket: Socket) => {
    logger.debug('new socket io connection established', socket);
});

httpServer.listen(3000);
