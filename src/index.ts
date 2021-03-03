import bot from './init/bot_init';
import db from './utils/database_init';
import { job } from './init/routine.init';
import { updateArenaList } from './commands/arena/shared/arena.update-list';

db.on('error', console.error.bind(console, 'connection error:'));

bot.on('allMessages', (e) => {
    console.log('raw event', e);
});

console.debug(job.nextInvocation());


export {};
