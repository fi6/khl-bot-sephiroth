import { AppCommand, BaseSession, Card, GuildSession } from 'kbotify';
import Arena, { ArenaDoc } from 'models/ArenaLegacy';
import configs, { roles } from '../../configs';
import arenaConfig from '../../configs/arena';
import { arenaManageCard } from './card/arena.manage.card';
import { arenaUpdateCard } from './card/arena.update.card';
import { updateArenaTitle } from './shared/arena.update-list';
import { voiceChannelManager } from './shared/arena.voice-manage';

class ArenaManage extends AppCommand {
    code = 'manage';
    trigger = '管理';
    help = '你可以更新房间信息，或关闭房间。发送`.关房`可快速关闭房间。';
    intro = '';
    func = async (s: BaseSession) => {
        const arena = await Arena.findById(s.user.id).exec();
        if (!arena || arena.expireAt < new Date()) {
            s.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText('没有找到可以管理的房间……请先创建房间。'),
            ]);
            return;
        }
        const session = GuildSession.fromSession(s);
        if (!session.args.length) {
            session.updateMessageTemp(arenaConfig.mainCardId, [
                arenaManageCard(arena),
            ]);
            return;
        }
        if (session.args[0] == '关闭') {
            this.close(session, arena);
            return;
        } else if (session.args[0] == '更新') {
            this.update(session, arena);
            return;
        } else if (session.args[0] == 'join') {
            this.join(session, arena);
            return;
        } else if (session.args[0] == '延期') {
            const expire = new Date();
            expire.setHours(expire.getHours() + 1);
            arena.expireAt = expire;
            arena.save();
            return session.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText('房间有效期已延长1小时'),
                arenaManageCard(arena),
            ]);
        }
    };

    private join = async (session: GuildSession, arena: ArenaDoc) => {
        if (session.args[1] == '1') arena.join = true;
        else arena.join = false;
        arena.save();
        return session.updateMessageTemp(configs.arena.mainCardId, [
            arenaManageCard(arena),
        ]);
    };

    private update = async (session: GuildSession, arena: ArenaDoc) => {
        await session.user.grantRole(roles.tempInput);
        await session.updateMessageTemp(
            arenaConfig.mainCardId,
            arenaUpdateCard(arena)
        );
        const input = await session.awaitMessage(/^\w{5}/, 120 * 1e3);
        if (!input)
            return session.updateMessageTemp(arenaConfig.mainCardId, [
                arenaManageCard(arena),
            ]);
        this.client?.API.message.delete(input.msgId);
        const [code, password, info, ...title] = [...input.content.split(/ +/)];
        arena.code = code;
        arena.password = password ?? arena.password;
        arena.info = info ?? arena.info;
        arena.title = title?.length ? title.join(' ') : arena.title;
        arena.save();

        return session.updateMessageTemp(configs.arena.mainCardId, [
            arenaManageCard(arena),
        ]);
    };

    private close = async (
        session: GuildSession,
        arena: ArenaDoc | undefined
    ) => {
        try {
            if (!arena) {
                return session.updateMessageTemp(configs.arena.mainCardId, [
                    new Card().addText('没有找到可关闭的房间……'),
                ]);
            }
            await Arena.findByIdAndUpdate(session.user.id, {
                expireAt: new Date(),
            }).exec();
            updateArenaTitle();
            voiceChannelManager.recycle(arena.voice);
            return await session.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText(
                    `房间 \`${arena.code}\` ${arena.title} 已关闭，语音频道将被回收。`
                ),
            ]);
        } catch (e) {
            console.error('Error when deleting arena', e, session);
            // data.result_status = ArenaResultStatus.error;
            // data.result.details = e;
            return session.replyTemp(
                `关闭房间时发生未知错误。请联系作者改bug(ಥ_ಥ)\n${e}`
            );
        }
    };
}

export const arenaManage = new ArenaManage();
