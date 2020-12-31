import bot from './src/utils/bot_init.js';
import db from './src/utils/database_init.js';

// bot.once('message', (e) => {
//     console.log('启动成功', e);
//     // bot.sendChannelMessage(1, e.channelId, 'init success')
// })

db.on('error', console.error.bind(console, 'connection error:'));

bot.once('rawEvent', (e) => {
    console.log('raw event', e);
});