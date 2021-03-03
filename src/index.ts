import bot from './init/bot_init';
import db from './utils/database_init';

db.on('error', console.error.bind(console, 'connection error:'));

bot.on('allMessages', (e) => {
    console.log('raw event', e);
});

export {};
