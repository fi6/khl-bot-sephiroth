import { AppCommand, AppFunc, BaseSession } from 'kbotify';
import { channel } from '../../configs';
import { parseCard } from '../../utils/card-parser';
import { verifyCard } from './card/phone-verify.card';
import { startCard } from './card/start.card';
import { termCard } from './card/terms.card';

class WelcomeStartApp extends AppCommand {
    trigger: string = '开始';
    func: AppFunc<BaseSession> = async (session) => {
        if (!session.args.length) return;
        switch (session.args[0]) {
            case '1':
                return session.sendCardTemp(parseCard(verifyCard()));

            case '2':
                return session.sendCardTemp(parseCard(termCard()));

            case '3': {
                const result = await session.user.grantRole(
                    15186,
                    '1843044184972950'
                );
                if (result.roles.includes(15186))
                    return session.sendCardTemp(parseCard(startCard()));
                else
                    return session.mentionTemp(
                        `授予角色失败了……如果你已经完成了手机认证，请在 (chn)${channel.feedback}(chn) 反馈问题。`
                    );
            }
            default:
                break;
        }
    };
}

export const welcomeStartApp = new WelcomeStartApp();
