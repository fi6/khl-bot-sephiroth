import bot from "../utils/bot_init.js";

function help(command, args, msg) {
    command = null;
    if (!args.length) {
        helpMenu(msg);
    }
}

function helpMenu(msg) {
    let content = ''.concat(
        '帮助菜单：\n',
        '房间相关：发送【.房间】获取帮助\n',
        '当前版本iOS会有消息不支持的问题，元旦后修正，请优先使用电脑客户端。\n')
    bot.sendChannelMessage(1, msg.channelId, content, msg.msgId);
}

export default help