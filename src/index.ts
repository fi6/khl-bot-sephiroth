import bot from './init/bot_init';
import db from './init/database_init';
import { arenaCardJob } from './init/routine.init';
import { updateArenaTitle } from './commands/arena/shared/arena.update-list';
import { log } from './init/logger';

db.on('error', console.error.bind(console, 'connection error:'));

bot.on('allMessages', (e) => {
    console.debug('raw event', e);
});

log.debug(arenaCardJob.nextInvocation());

export {};
