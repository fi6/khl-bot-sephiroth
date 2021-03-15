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

const bot = new KBotify({
    mode: 'websocket',
    token: auth.khltoken,

    ignoreDecryptError: false,
});

bot.connect();

bot.addCommands(arenaMenu, utilApp, welcomeEntry, trainingMenu);
bot.addAlias(arenaCreate, '建房');
// bot.addAlias(arenaList, '找房');
// bot.addAlias(arenaDelete, '关房');

bot.on('unknownEvent', (e) => {
    console.debug(e);
});

bot.message.on('text', (msg) => {
    if (msg.content == '房间') {
        return arenaMenu.exec(createSession(arenaMenu, [], msg, bot));
    }
});

bot.execute = async (command: string, args: string[], msg: any) => {
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
    console.debug(input);
    const cloudReg = /克劳德/;
    const regex = /^[\u4e00-\u9fa5]/;
    const cmd = bot.commandMap.get(command);
    // console.debug(bot.commandMap);
    if (cmd) return cmd.exec(createSession(cmd, args, msg));
    switch (command) {
        case '开房':
        case '建房':
            return arenaCreate.exec(...input);
        case '找房':
            return arenaList.exec(...input);
        case '关房':
            return arenaManage.exec(command, ['关闭'], msg);
        // case '房间':
        //     return arenaMenu.exec(...input);
        case '帮助':
            bot.API.message.create(9, msg.channelId, '帮助文字还没写，别急');
            break;
        // case '档案':
        //     profileCommand(command, args, msg)
        default:
            if (cloudReg.test(command)) {
                const line = callCloud.call();
                if (line) {
                    bot.API.message.create(1, msg.channelId, line);
                    break;
                }
            }
            return;
        // if (regex.test(command) && command != '天梯') {
        //     bot.API.message.create(
        //         1,
        //         msg.channelId,
        //         '不是有效的命令。查看帮助请发送[.帮助]'
        //     );
        //     break;
        // }
        // return bot.API.message.create(
        //     9,
        //     msg.channelId,
        //     '帮助文字还没写，别急'
        // );
    }
    console.log(command, args);
};

export default bot;
