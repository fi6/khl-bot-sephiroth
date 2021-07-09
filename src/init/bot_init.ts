import { arenaCreate } from '../commands/arena/arena.create.app';
// import { arenaDelete } from 'commands/arena/arena.delete.app';
// import { arenaList } from 'commands/arena/arena.list.app';
// import { arenaMenu } from 'commands/arena/arena.menu';
import auth from 'configs/auth';
import { BaseSession, createSession, KBotify } from 'kbotify';

// import profileCommand from '../commands/profile'
import { callCloud } from '../utils/utils';
import { arenaMenu } from '../commands/arena/arena.menu';
import { arenaManage } from '../commands/arena/arena.manage.app';
import { arenaList } from '../commands/arena/arena.list.app';
import { utilApp } from '../commands/util.app';
import { welcomeEntry } from '../commands/welcome/welcome.entry';
import { TextMessage } from 'kbotify/dist/core/message';
import { trainingMenu } from '../commands/training/training.menu';
import { log } from './logger';
import configs from '../configs';

const bot = new KBotify({
    mode: 'webhook',
    token: auth.khltoken,
    port: auth.khlport,
    verifyToken: auth.khlverify,
    key: auth.khlkey,
    ignoreDecryptError: false,
    debug: true,
});

bot.connect();

bot.addCommands(arenaMenu, utilApp, welcomeEntry, trainingMenu);
bot.addAlias(arenaCreate, '建房');
// bot.addAlias(arenaList, '找房');
// bot.addAlias(arenaDelete, '关房');

bot.on('unknownEvent', (e) => {
    log.debug(e);
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
    // const channelList = ['4873200132116685', '3072169336937497'];
    // if (!channelList.includes(msg.channelId)) {
    //     bot.API.message.create(
    //         1,
    //         msg.channelId,
    //         'bot当前仅在闲聊频道使用，仅内测用户可用',
    //         msg.msgId
    //     );
    //     return;
    // }
    const input: [string, string[], TextMessage] = [command, args, msg];
    log.debug(input);
    const cloudReg = /克劳德/;
    const regex = /^[\u4e00-\u9fa5]/;
    const cmd = bot.commandMap.get(command);
    // console.debug(bot.commandMap);
    if (cmd) return cmd.exec(createSession(cmd, args, msg));

    if (
        msg.channelId == configs.channels.coach &&
        msg.mention.user.includes(bot.userId)
    )
        return trainingMenu.exec(createSession(trainingMenu, args, msg));
    log.debug(command, args);
};

export default bot;
