import { AppCommand, AppCommandFunc, BaseSession } from 'kbotify';
import Arena from 'models/Arena';
import channel from '../../configs/channel';
import { card } from './card/kaiheila.card';
import { welcomeShortcut } from './welcome.shortcut';

class WelcomeEntry extends AppCommand {
    code = 'list';
    trigger = '欢迎';
    intro = '';
    help = '';
    func: AppCommandFunc<BaseSession> = async (session) => {
        if (!session.args.length) {
            session.bot.grantUserRole(
                '1843044184972950',
                session.user.id,
                15186
            );
            session.mentionTemp(
                `欢迎加入斗天堂！已为你开启服务器功能。\n手机版请点击左上角查看频道。先试着在 (chn)${channel.chat}(chn) 和大家打个招呼吧！`
            );
        }
        if (session.args[0] == '快捷'){
            session.args.shift()
            return welcomeShortcut.func(session)
        }
        if (session.args[0] == '开黑啦') {
            session.sendCardTemp(JSON.stringify([card()]));
        }
    };
}

export const welcomeEntry = new WelcomeEntry();
