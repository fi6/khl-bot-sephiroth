import {
    AppCommand,
    AppFunc,
    BaseSession,
    Card,
    createSession,
    GuildSession,
} from 'kbotify';
import { isNotifyTime } from '../../utils/notif-time';
import Arena, { ArenaDoc } from '../../models/Arena';
import configs from '../../configs';
import { formatTime } from '../../utils/format-time';
import { fiSocket } from '../../init/socket-io';

class ArenaAlert extends AppCommand {
    code = 'alert';
    trigger = '广播';
    help = '';
    intro = '';
    // cache = new LRUCache<string, () => void>({ maxAge: 90 * 1e3 });
    func: AppFunc<BaseSession> = async (s) => {
        const session = await GuildSession.fromSession(s, true);
        const arena = await Arena.findById(session.user.id).exec();
        let comment = '!';
        if (!arena)
            return session.sendTemp(
                '没有找到可广播的房间。请先发送`.建房`创建房间。'
            );
        if (arena.expired)
            return session.sendTemp('房间已过有效期，请先更新房间信息');
        // if (!isNotifyTime(new Date()))
        //     return session.mentionTemp(
        //         '当前不是可广播的时间。工作日晚18-24点，非工作日早8点-晚24点可以广播。'
        //     );
        if (!arena.public) {
            if (arena.public === undefined) arena.update({ public: false });
            return session.mentionTemp('请先在房间管理中将房间密码设置为公开');
        }
        if (!fiSocket?.connected) {
            return session.updateMessageTemp(configs.arena.mainCardId, [
                new Card()
                    .addText('似乎负责广播的bot没有上线……请联系冰飞获取帮助。')
                    .setTheme('warning'),
            ]);
        }
        if (!arena.allowBroadcast) arena.update({ allowBroadcast: new Date() });
        if (arena.allowBroadcast > new Date()) {
            return session.updateMessageTemp(configs.arena.mainCardId, [
                new Card()
                    .addText(
                        '你的广播还在冷却中，下次可使用时间：' +
                            formatTime(arena.allowBroadcast)
                    )
                    .setTheme('warning'),
            ]);
        }
        if (!session.args.length) {
            await session.user.grantRole(configs.roles.tempInput);
            await session.updateMessageTemp(configs.arena.mainCardId, [
                new Card()
                    .addText(
                        '请在60秒内输入广播留言，如：`练习一八对策，求一八大佬`。\n广播功能每天限一次，请确保你的房间信息准确无误，记得使用文明用语（'
                    )
                    .addText('输入`取消`以取消广播')
                    .addCountdown('second', new Date().valueOf() + 6e4),
            ]);
            const input = await session.awaitMessage(/.+/, 6e4);
            session.user.revokeRole(configs.roles.tempInput);
            if (!input) return session.mentionTemp('未收到输入，已取消广播');
            input.delete();
            if (input?.content.includes('取消'))
                return session.mentionTemp('已取消广播');
            comment = input.content;
        }

        this.broadcast(session, arena, comment);
        await session._send(
            `${
                arena.nickname
            } 的房间正在寻找小伙伴加入！\n${arena.toInfoString()}\n留言：${comment}`,
            undefined,
            { channel: configs.channels.chat }
        );

        // sleep for 300 ms
        await new Promise((resolve) => setTimeout(resolve, 50));
        const nextBroadcast = new Date();
        nextBroadcast.setHours(nextBroadcast.getHours() + 23);
        arena.allowBroadcast = nextBroadcast;
        arena.save();
    };
    broadcast = (session: GuildSession, arena: ArenaDoc, comment: string) => {
        const text = `${
            arena.nickname
        }的房间正在寻找玩家，房间信息⬇️\n${arena.toInfoString()}\n留言：${comment}\n查看全部房间请发送'.找房'`;
        fiSocket.emit('arena:broadcast', text, (response: any) => {
            if (response.status == 'OK') {
                session.sendTemp('广播成功，请等待其他玩家加入～');
            } else {
                session.sendTemp('广播似乎出了问题……请联系冰飞以获取帮助。');
            }
        });
    };
}

export const arenaBroadcast = new ArenaAlert();
