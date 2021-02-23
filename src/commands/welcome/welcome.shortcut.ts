import { AppCommand, AppCommandFunc, BaseSession } from 'kbotify';
import Arena from 'models/Arena';
import channel from '../../configs/channel';
import { cardParser } from '../../utils/card-parser';
import { mentionUser } from '../../utils/khl';
import { arenaList } from '../arena/arena.list.app';
import { ArenaSession } from '../arena/arena.types';
import { createStartCard } from '../arena/card/arena.create.card';
import { arenaListCard } from '../arena/card/arena.list.card';
import { arenaGetValid } from '../arena/shared/arena.get-valid';

class WelcomeShortcut extends AppCommand {
    code = 'list';
    trigger = '快捷';
    intro = '';
    help = '';
    func: AppCommandFunc<ArenaSession> = async (session) => {
        if (!session.args.length) {
            return;
        }
        if (session.args[0] == '找房') {
            // await session.mentionTemp(
            //     `你也可以在 (chn)${channel.chat}(chn) 发送 \`.找房\` 快速查看房间。`
            // );
            this.arenaList(session);
        }
        if (session.args[0] == '斗天梯') {
            return session.mentionTemp(
                `使用斗天梯请在 (chn)${channel.chat}(chn) 发送 \`斗天梯\` 三个字。\n点击紫色字可以快速跳转频道。`
            );
        }
        if (session.args[0] == '建房') {
            session.mentionTemp(
                `已在 (chn)${channel.chat}(chn) 频道发送创建帮助！\n请根据帮助上的指示完成创建。（点击紫色字可以快速跳转频道）`
            );
            session._send(cardParser(createStartCard()), undefined, {
                msgType: 10,
                temp: true,
                replyAt: channel.chat,
            });
        }
    };
    arenaList = async (session: ArenaSession) => {
        const arenas = await arenaGetValid();
        if (!arenas || !arenas.length) {
            return session.sendCardTemp(arenaEmptyCard(session));
        }
        return session.sendCardTemp(arenaListCard(session));
    };
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
