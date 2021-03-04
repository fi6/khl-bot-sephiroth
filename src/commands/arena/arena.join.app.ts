import { ArenaSession } from 'commands/arena/arena.types';
import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena from 'models/Arena';
import { arenaLeave } from './arena.leave.app';
import { arenaCheckMember } from './shared/arena.check-member';
import { arenaGetValid } from './shared/arena.get-valid';

class ArenaJoin extends AppCommand {
    trigger = '加入';

    help = '仅可通过按钮加入';
    func: AppCommandFunc<ArenaSession> = async (session: ArenaSession) => {
        const [msg, args] = [session.msg, session.args as string[]];

        // if (msg.mention.user.length != 1) {
        //     session.reply(this.help);
        // }
        session.arena = await Arena.findOne({
            _id: session.args[0],
        }).exec();
        if (!session.arena) return session.sendTemp('没有找到对应房间。');

        if (session.arena.member?.length) {
            for (const user of session.arena.member) {
                if (user._id == session.userId) {
                    return session.replyTemp(
                        '你已经在此房间中。如需更换房间请输入`.房间 退出`。'
                    );
                }
            }
        }
        session.arenas = await arenaGetValid();
        session.arenas.forEach((arena) => {
            if (arenaCheckMember(arena, session.userId)) {
                arenaLeave.leave(arena, session.userId);
                session.mentionTemp(`已退出${arena.userNick}的房间`)
            }
        });
        console.log('queue:', session.arena.member);
        if (!session.arena.member) {
            session.arena.member = [];
        }
        session.arena.member.push({
            _id: session.user.id,
            userNick: session.user.username,
        });
        session.arena.isNew = false;
        session.arena.markModified('member');
        await session.arena.save();
        const arena = session.arena;
        return session.mentionTemp(
            ''.concat(
                `房间密码：${session.arena.password}\n成功加入`,
                `\`${arena.userNick}的房间\``
            )
        );
    };
}

export const arenaJoin = new ArenaJoin();
