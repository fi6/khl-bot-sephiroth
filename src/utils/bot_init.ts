import { KaiheilaBot } from 'kaiheila-bot-root';
import {
    KMarkDownMessage,
    MessageType,
    TextMessage,
} from 'kaiheila-bot-root/dist/types';
import dotenv from 'dotenv'
import arenaCommand from '../commands/arena/arena-commands';
// import profileCommand from '../commands/profile'
import help from '../commands/help';
import { callCloud } from './utils';

dotenv.config()

const bot = new KaiheilaBot({
    mode: 'webhook',
    port: 20600,
    key: process.env.KHLKEY,
    token: process.env.KHLTOKEN as string,
    verifyToken: process.env.KHLVERIFY as string,
    ignoreDecryptError: false,
});

bot.listen();

const botId = '806285597';

bot.on('message', (msg: TextMessage) => {
    // console.log('msg', msg)
    if (msg.type != MessageType.text) {
        return;
    }
    msg = msg as TextMessage;
    const [command, ...args] = preProcess(msg);
    if (command === '') {
        return;
    }
    execute(command.toLowerCase(), args, msg);
});

function preProcess(msg: TextMessage | KMarkDownMessage): string[] {
    if (msg.content.startsWith('.') || msg.content.startsWith('。')) {
        // console.log(msg)
        return msg.content.slice(1).trim().split(/ +/);
    }
    if (msg.mention.user[0] == botId) {
        const [mention, ...content] = msg.content.trim().split(/ +/);
        if (mention.startsWith('@')) {
            if (content.length) {
                return content;
            } else {
                return ['help'];
            }
        }
    }
    return [''];
}

async function execute(
    command: string,
    args: string[],
    msg: TextMessage | KMarkDownMessage
) {
    // const channelList = ['4873200132116685', '3072169336937497'];
    // if (!channelList.includes(msg.channelId)) {
    //     bot.sendChannelMessage(
    //         1,
    //         msg.channelId,
    //         'bot当前仅在闲聊频道使用，仅内测用户可用',
    //         msg.msgId
    //     );
    //     return;
    // }
    const cloudReg = /克劳德/;
    const regex = /^[\u4e00-\u9fa5]/;
    switch (command) {
        case '开房':
        case '建房':
        case '找房':
        case '关房':
        case '房间':
            arenaCommand(command, args, msg);
            break;
        case '帮助':
            help(command, args, msg);
            break;
            // case '档案':
            //     profileCommand(command, args, msg)
            break;
        case 'test':
            bot.sendChannelMessage(
                9,
                msg.channelId,
                '```' +
                    `${args[0]}\n房主：\n房间号：BPTC1\n密码：147\n留言：萌新马里奥想找剑人练习~\n创建时间：13:21\n` +
                    '```'
            );
            break;
        default:
            if (cloudReg.test(command)) {
                const line = callCloud.call();
                if (line) {
                    bot.sendChannelMessage(1, msg.channelId, line);
                    break;
                }
            }
            if (regex.test(command)) {
                bot.sendChannelMessage(
                    1,
                    msg.channelId,
                    '不是有效的命令。查看帮助请发送[.帮助]'
                );
                break;
            }
            return help(command, args, msg);
    }
    // console.log(command, args)
}


export default bot