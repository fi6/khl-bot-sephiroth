import { AppCommand, BaseSession, Card, GuildSession } from 'kbotify';
import Arena, { ArenaDoc } from 'models/Arena';
import configs, { roles } from '../../configs';
import arenaConfig from '../../configs/arena';
import { log } from '../../init/logger';
import { arenaManageCard } from './card/arena.manage.card';
import { arenaUpdateCard } from './card/arena.update.card';
import { expireManager } from './shared/arena.expire-manager';
import { updateArenaTitle } from './shared/arena.update-list';
import { voiceChannelManager } from './shared/arena.voice-manager';

class ArenaManage extends AppCommand {
    code = 'manage';
    trigger = '管理';
    help = '你可以更新房间信息，或关闭房间。发送`.关房`可快速关闭房间。';
    intro = '';
    func = async (s: BaseSession) => {
        const arena = await Arena.findById(s.user.id).exec();
        if (!arena) {
            s.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText('没有找到可以管理的房间……请先创建房间。'),
            ]);
            return;
        }
        const session = await GuildSession.fromSession(s);
        if (!session.args.length) {
            session.updateMessageTemp(
                arenaConfig.mainCardId,
                arenaManageCard(arena)
            );
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
            this.extend(session, arena);
        }
    };

    private join = async (session: GuildSession, arena: ArenaDoc) => {
        if (session.args[1] == '1') arena.join = true;
        else arena.join = false;
        arena.save();
        return session.updateMessageTemp(
            configs.arena.mainCardId,
            arenaManageCard(arena)
        );
    };

    private update = async (session: GuildSession, arena: ArenaDoc) => {
        await session.user.grantRole(roles.tempInput);
        await session.updateMessageTemp(
            arenaConfig.mainCardId,
            arenaUpdateCard(arena)
        );
        const input = await session.awaitMessage(/^\w{5}/, 120 * 1e3);
        if (!input)
            return session.updateMessageTemp(
                arenaConfig.mainCardId,
                arenaManageCard(arena)
            );
        this.client?.API.message.delete(input.msgId);
        const [code, password, info, ...title] = [...input.content.split(/ +/)];
        arena.code = code;
        arena.password = password ?? arena.password;
        arena.info = info ?? arena.info;
        arena.title = title?.length ? title.join(' ') : arena.title;
        arena.save();

        return session.updateMessageTemp(
            configs.arena.mainCardId,
            arenaManageCard(arena)
        );
    };

    close = async (session: GuildSession, arena: ArenaDoc | undefined) => {
        log.info('closing arena', arena);
        try {
            if (!arena) {
                return session.updateMessageTemp(configs.arena.mainCardId, [
                    new Card().addText('没有找到可关闭的房间……'),
                ]);
            }
            expireManager.shutdown(arena);
            updateArenaTitle();
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
    private extend = async (session: GuildSession, arena: ArenaDoc) => {
        expireManager.extend(arena, 90);

        return session.updateMessageTemp(configs.arena.mainCardId, [
            new Card().addText('房间有效期已延长90分钟'),
            ...arenaManageCard(arena),
        ]);
    };
}

export const arenaManage = new ArenaManage();
