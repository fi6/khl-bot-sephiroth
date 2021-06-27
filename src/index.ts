import bot from './init/bot_init';
import db from './init/database_init';
import { arenaCardJob } from './init/routine.init';
import { updateArenaTitle } from './commands/arena/shared/arena.update-list';

db.on('error', console.error.bind(console, 'connection error:'));

bot.on('allMessages', (e) => {
    console.log('raw event', e);
});

console.debug(arenaCardJob.nextInvocation());


export {};
