import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify';
import Arena, { ArenaDoc } from 'models/Arena';
import configs, { channels } from '../../configs';
import { log } from '../../init/logger';
import { arenaLeave } from './arena.leave.app';
import LRUCache from 'lru-cache';
import { arenaCheckMember } from './shared/arena.check-member';
import { arenaGetValid } from './shared/arena.get-valid';
import { updateArenaTitle } from './shared/arena.update-list';

class ArenaJoin extends AppCommand {
    trigger = '加入';

    help = '仅可通过按钮加入';
    fullCache: LRUCache<string, Map<string, boolean>> = new LRUCache({
        maxAge: 10 * 6e4,
    });
    func: AppFunc<BaseSession> = async (s) => {
        log.info('session:', s);
        const session = await GuildSession.fromSession(s, true);

        const arena = await Arena.findOne({
            _id: session.args[0],
        }).exec();
        if (!arena) return session.sendTemp('没有找到对应房间。');

        if (session.args.length == 2) {
            return this.reportFull(session, arena);
        } else return this.join(session, arena);
    };

    join = async (session: GuildSession, arena: ArenaDoc) => {
        if (arena.member?.length) {
            for (const user of arena.member) {
                if (user._id == session.userId) {
                    return session.replyTemp(
                        '你已经在此房间中，房间密码为' +
                            arena.password +
                            '\n如需更换房间请输入`.房间 退出`。'
                    );
                }
            }
        }
        let leaveMessage = '';
        const arenas = await arenaGetValid();
        arenas.forEach((arena) => {
            if (arenaCheckMember(arena, session.userId)) {
                arenaLeave.leave(arena, session.userId);
                leaveMessage = `已退出${arena.nickname}的房间。\n`;
            }
        });
        log.info('queue:', arena.member);
        if (!arena.member) {
            arena.member = [];
        }
        arena.member.push({
            _id: session.user.id,
            nickname: session.user.username,
        });
        arena._empty = false;
        arena.isNew = false;
        arena.markModified('member');
        await arena.save();
        if (arena.memberCount >= arena.limit - 1)
            this.remindHost(session, arena, true);
        else this.remindHost(session, arena, false);
        updateArenaTitle();
        session._send(
            // eslint-disable-next-line no-useless-escape
            `\[${arena.title}\]${arena.invite}\n点击下方按钮加入语音房间`,
            undefined,
            {
                msgType: 1,
                temp: true,
            }
        );
        return await session.updateMessageTemp(configs.arena.mainCardId, [
            new Card()
                .addTitle('加入房间')
                .addText(
                    ''.concat(
                        leaveMessage,
                        `欢迎加入${arena.title}！`,
                        `\n房间号：${arena.code}，房间密码：${arena.password}`
                    ),
                    undefined,
                    'right',
                    {
                        type: 'button',
                        click: 'return-val',
                        value: `.房间 加入 ${arena.id} full`,
                        theme: 'primary',
                        text: {
                            type: 'plain-text',
                            content: '房间已满？',
                        },
                    }
                )
                .addText('**请尽量加入语音，有交流的对战会更有趣哦！**'),
        ]);
    };

    reportFull = async (session: GuildSession, arena: ArenaDoc) => {
        const fullMap = this.fullCache.get(arena.id);
        if (fullMap) fullMap.set(session.user.id, true);
        this.fullCache.set(
            arena.id,
            fullMap ?? new Map([[session.user.id, true]])
        );

        const num = fullMap?.size;
        if (num && num >= 3) {
            arena.join = false;
            arena.save();
        }
        session.updateMessageTemp(configs.arena.mainCardId, [
            new Card().addText(
                '报告成功。如果有多人报告房间已满，系统会将房间标记为暂停加入。\n你可以重新查看列表并加入其他房间。'
            ),
        ]);
        this.client?.API.message.create(
            9,
            channels.chat,
            `(met)${arena.id}(met) 你的房间似乎是满的……如果有多人报告房间已满，系统会将房间标记为暂停加入。\n你也可以在房间管理菜单中暂停/开启加入。`,
            undefined,
            arena.id
        );
    };

    remindHost = async (
        session: GuildSession,
        arena: ArenaDoc,
        full = true
    ) => {
        let reminder = `(met)${arena.id}(met) 有玩家加入房间：\`${
            session.user.nickname ?? session.user.username
        }\``;
        if (full)
            reminder =
                reminder +
                `\n房间似乎已满……请在(chn)${channels.arenaBot}(chn)点击管理房间-暂停加入。`;

        this.client?.API.message.create(
            9,
            channels.chat,
            reminder,
            undefined,
            arena.id
        );
    };
}

export const arenaJoin = new ArenaJoin();
