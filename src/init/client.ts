import { arenaCreate } from '../commands/arena/arena.create.app';
import auth from 'configs/auth';
import { createSession, KBotify } from 'kbotify';

import { arenaMenu } from '../commands/arena/arena.menu';

import { utilApp } from '../commands/util.app';
import { welcomeEntry } from '../commands/welcome/welcome.entry';
import { TextMessage } from 'kbotify/dist/core/message';
import { trainingMenu } from '../commands/training/training.menu';
import { logger } from './logger';
import configs from '../configs';
import { eventMenu } from '../commands/event/event.menu';

const bot = new KBotify({
    // mode: 'websocket',
    mode: 'webhook',
    token: auth.khltoken,
    port: auth.khlport,
    verifyToken: auth.khlverify,
    key: auth.khlkey,
    ignoreDecryptError: false,
    debug: true,
});

bot.connect();

bot.addCommands(arenaMenu, utilApp, welcomeEntry, trainingMenu, eventMenu);
bot.addAlias(arenaCreate, '建房');
// bot.addAlias(arenaList, '找房');
// bot.addAlias(arenaDelete, '关房');

bot.on('unknownEvent', (e) => {
    logger.debug(e);
});

bot.message.on('text', (msg) => {
    if (msg.content == '房间') {
        return arenaMenu.exec(createSession(arenaMenu, [], msg, bot));
    }
});

bot.execute = async (
    command: string,
    args: string[],
    msg: any | TextMessage
) => {
    const input: [string, string[], TextMessage] = [command, args, msg];
    logger.debug(input);
    const regex = /^[\u4e00-\u9fa5]/;
    const cmd = bot.commandMap.get(command);
    if (cmd) return cmd.exec(createSession(cmd, args, msg));

    if (
        msg.channelId == configs.channels.coach &&
        msg.mention.user.includes(bot.userId)
    )
        return trainingMenu.exec(createSession(trainingMenu, args, msg));
    logger.debug(command, args);
};

export default bot;
