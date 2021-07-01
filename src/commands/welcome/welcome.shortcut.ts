import { AppCommand, AppFunc, BaseSession, GuildSession } from 'kbotify';
import { Card } from 'kbotify/dist/core/card';
import Arena from 'models/ArenaLegacy';
import channel from '../../configs/channels';
import { parseCard } from '../../utils/card-parser';
import { mentionUser } from '../../utils/khl';
import { arenaCreate } from '../arena/arena.create.app';
import { arenaList } from '../arena/arena.list.app';
import { ArenaSession } from '../arena/arena.types';
import { createStartCard } from '../arena/card/arena.create.card';
import { arenaListCard } from '../arena/card/arena.list.card';
import { arenaGetValid } from '../arena/shared/arena.get-valid';
import { updateArenaTitle } from '../arena/shared/arena.update-list';

class WelcomeShortcut extends AppCommand {
    code = 'list';
    trigger = '快捷';
    intro = '';
    help = '';
    func: AppFunc<BaseSession> = async (session) => {
        if (!session.args.length) {
            return;
        }

        if (session.args[0] == '斗天梯') {
            return session.mentionTemp(
                `使用斗天梯请在 (chn)8769493745666772(chn)点击按钮启动。\n点击紫色字可以快速跳转频道。\n如果字体不是紫色，请返回欢迎频道点击开始使用以启用功能。`
            );
        }
    };
    // arenaList = async (session: ArenaSession) => {
    //     const arenas = await arenaGetValid();
    //     session.arenas = arenas;
    //     if (!arenas || !arenas.length) {
    //         return session.sendCardTemp(arenaEmptyCard(session));
    //     }
    //     return session.sendCardTemp(arenaListCard(session, arenas));
    // };
}

function arenaEmptyCard(session: BaseSession) {
    return JSON.stringify([
        {
            type: 'card',
            theme: 'secondary',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '查看房间列表',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: `${mentionUser(
                            session.user.id
                        )}暂时没有活跃的房间……你可以点击上方按钮创建房间。`,
                    },
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'plain-text',
                            content: '你也可以在闲聊频道发送 .找房 查看房间',
                        },
                    ],
                },
            ],
        },
    ]);
}

export const welcomeShortcut = new WelcomeShortcut();
