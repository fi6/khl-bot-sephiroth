import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify';
import Arena, { ArenaDoc } from 'models/Arena';
import configs, { channels } from '../../configs';
import { log } from '../../init/logger';
import { arenaLeave } from './arena.leave.app';
import { arenaList } from './arena.list.app';
import { ArenaSession } from './arena.types';
import { arenaCheckMember } from './shared/arena.check-member';
import { arenaGetValid } from './shared/arena.get-valid';
import { updateArenaTitle } from './shared/arena.update-list';

class ArenaJoin extends AppCommand {
    trigger = '加入';

    help = '仅可通过按钮加入';
    func: AppFunc<BaseSession> = async (s) => {
        log.info('session:', s);
        const session = await GuildSession.fromSession(s, true);

        const arena = await Arena.findOne({
            _id: session.args[0],
        }).exec();
        if (!arena) return session.sendTemp('没有找到对应房间。');

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
        updateArenaTitle();
        if (arena.memberCount >= arena.limit)
            this.remindHost(session, arena, true);
        else this.remindHost(session, arena, false);
        session._send(
            // eslint-disable-next-line no-useless-escape
            `\[${arena.title}\]的语音房间链接：${arena.invite}\n点击下方按钮即可加入，也可以分享链接给群友一起聊天～`,
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
                    )
                )
                .addText('语音房间链接在下方，点击即可加入。'),
        ]);
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
                `\n房间似乎已满……你可以在(chn)${channels.arenaBot}(chn)点击管理房间-暂停加入。`;

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
