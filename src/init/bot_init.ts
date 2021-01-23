import { arenaCreate } from 'commands/arena/arena.create.app';
import { arenaDelete } from 'commands/arena/arena.delete.app';
import { arenaList } from 'commands/arena/arena.list.app';
import { arenaMenu } from 'commands/arena/arena.menu';
import auth from 'configs/auth';
import { KMarkDownMessage, TextMessage } from 'kaiheila-bot-root/dist/types';
import { KBotify } from 'kbotify';
import {CurrentUserInfo} from 'kaiheila-bot-root/dist/types/api'

// import profileCommand from '../commands/profile'
import { callCloud } from '../utils/utils';

const bot = new KBotify({
    mode: 'webhook',
    port: auth.khlport,
    key: auth.khlkey,
    token: auth.khltoken,
    verifyToken: auth.khlverify,
    ignoreDecryptError: false,
});

bot.connect();

bot.getCurrentUserInfo().then((info:CurrentUserInfo )=> {bot.botId = info.id
})

console.log(bot.post('/v3/guild-role/grant', {user_id: '2321962160', guild_id: '4770323118755977', role_id: 12372}))

bot.botId;

bot.addCommands(arenaMenu);
bot.addAlias(arenaCreate, '建房');
bot.addAlias(arenaList, '找房');
bot.addAlias(arenaDelete, '关房');

// bot.execute = async (
//     command: string,
//     args: string[],
//     msg: TextMessage | KMarkDownMessage
// ) => {
//     // const channelList = ['4873200132116685', '3072169336937497'];
//     // if (!channelList.includes(msg.channelId)) {
//     //     bot.sendChannelMessage(
//     //         1,
//     //         msg.channelId,
//     //         'bot当前仅在闲聊频道使用，仅内测用户可用',
//     //         msg.msgId
//     //     );
//     //     return;
//     // }
//     const input: [string, string[], TextMessage] = [command, args, msg];
//     console.debug(input);
//     const cloudReg = /克劳德/;
//     const regex = /^[\u4e00-\u9fa5]/;
//     switch (command) {
//         case '开房':
//         case '建房':
//             return arenaCreate.exec(...input);
//         case '找房':
//             return arenaList.exec(...input);
//         case '关房':
//             return arenaDelete.exec(...input);
//         case '房间':
//             return arenaMenu.exec(...input);
//         case '帮助':
//             bot.sendChannelMessage(9, msg.channelId, '帮助文字还没写，别急');
//             break;
//             // case '档案':
//             //     profileCommand(command, args, msg)
//             break;
//         case 'test':
//             bot.sendChannelMessage(
//                 9,
//                 msg.channelId,
//                 '```' +
//                     `${args[0]}\n房主：\n房间号：BPTC1\n密码：147\n留言：萌新马里奥想找剑人练习~\n创建时间：13:21\n` +
//                     '```'
//             );
//             break;
//         default:
//             if (cloudReg.test(command)) {
//                 const line = callCloud.call();
//                 if (line) {
//                     bot.sendChannelMessage(1, msg.channelId, line);
//                     break;
//                 }
//             }
//             if (regex.test(command)) {
//                 bot.sendChannelMessage(
//                     1,
//                     msg.channelId,
//                     '不是有效的命令。查看帮助请发送[.帮助]'
//                 );
//                 break;
//             }
//             return bot.sendChannelMessage(
//                 9,
//                 msg.channelId,
//                 '帮助文字还没写，别急'
//             );
//     }
//     // console.log(command, args)
// };

export default bot;
