import bunyan from 'bunyan';
import fs from 'fs';
import { DateTime } from 'luxon';
import path from 'path';
import winston, { format } from 'winston';
import { getNow } from '../utils/format-time';

const now = getNow();

const folder = path.resolve(process.cwd(), 'logs', `${now.toISODate()}`);
console.log('log folder: ', folder);
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

const buffer = new bunyan.RingBuffer({});

buffer.write = (data) => {
    console.log(data);
    return true;
};

class ConsoleTransport extends winston.transports.Console {
    log(info: any, callback: () => void) {
        setImmediate(() => {
            this.emit('logged', info);
        });
        const { stack, timestamp, level, message, ...meta } = info;
        console.log(
            timestamp,
            level,
            message,
            meta[Symbol.for('splat')],
            stack
        );

        if (callback) {
            callback();
        }
    }
}

export const log = winston.createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [
        new ConsoleTransport(),
        new winston.transports.File({
            filename: path.resolve(folder, now.toFormat('HH-mm-ss')),
        }),
    ],
});

// export const log = bunyan.createLogger({
//     name: 'arena',
//     src: true,
//     streams: [
//         { level: 'debug', type: 'raw', stream: buffer },
//         {
//             level: 'warn',
//             path: path.resolve(
//                 folder,
//                 `${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}}`
//             ),
//         },
//     ],
// });

const stream: bunyan.Stream | undefined = undefined;
