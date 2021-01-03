import { TextMessage } from 'kaiheila-bot-root/dist/types';
import bot from 'utils/bot_init';

function help(command: string, args: string[], msg: TextMessage): void {
    command = '';
    if (!args.length) {
        helpMenu(msg);
    }
}

function helpMenu(msg: TextMessage) {
    const content = ''.concat(
        '帮助菜单：\n',
        '房间相关：发送【.房间】获取帮助\n',
        '当前版本iOS会有消息不支持的问题，元旦后修正，请优先使用电脑客户端。\n'
    );
    bot.sendChannelMessage(1, msg.channelId, content, msg.msgId);
}

export default help;
