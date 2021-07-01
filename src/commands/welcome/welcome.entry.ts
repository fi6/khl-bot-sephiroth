import { AppCommand, AppFunc, BaseSession, MenuCommand } from 'kbotify';
import Arena from 'models/ArenaLegacy';
import channel from '../../configs/channels';
import { kaiheilaCard } from './card/kaiheila.card';
import { welcomeStartApp } from './start.app';
import { welcomeShortcut } from './welcome.shortcut';

class WelcomeEntry extends MenuCommand {
    code = 'list';
    trigger = '欢迎';
    intro = '';
    help = '';
    exec = async (session: BaseSession) => {
        if (!session.args.length) {
            session.user.grantRole(15186, '1843044184972950');
            session.mentionTemp(
                `欢迎加入斗天堂！已为你开启服务器功能。\n手机版请点击左上角查看频道。先试着在 (chn)${channel.chat}(chn) 和大家打个招呼吧！`
            );
            return;
        }
        if (session.args[0] == '快捷') {
            session.args.shift();
            welcomeShortcut.func(session);
            return;
        }
        if (session.args[0] == '开黑啦') {
            session.sendCardTemp(JSON.stringify([kaiheilaCard()]));
        }
        if (session.args[0] == '开始') {
            session.args.shift();
            welcomeStartApp.exec(session);
        }
    };
}

export const welcomeEntry = new WelcomeEntry(welcomeStartApp, welcomeShortcut);
