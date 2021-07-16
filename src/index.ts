import bot from './init/bot_init';
import db from './init/database_init';
import { arenaCardJob } from './init/routine.init';
import { logger } from './init/logger';
import './init/socket-io';

db.on('error', console.error.bind(console, 'connection error:'));

bot.on('allMessages', (e: any) => {
    if (
        typeof e.data?.type === 'string' &&
        (e.data?.type as string).startsWith('guild_member')
    )
        return;
    logger.debug(e.data?.type, e);
});

logger.debug(arenaCardJob.nextInvocation());

export {};
