import bot from './init/bot_init';
import db from './utils/database_init';

bot.once('rawEvent', (e) => {
    console.log('启动成功', e);
    // bot.sendChannelMessage(1, e.channelId, 'init success')
});

db.on('error', console.error.bind(console, 'connection error:'));

bot.on('rawEvent', (e) => {
    console.log('raw event', e);
});

export {};
