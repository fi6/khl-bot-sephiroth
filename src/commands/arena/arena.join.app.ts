import { AppCommand, AppFunc } from 'kbotify';
import Arena from 'models/Arena';
import { arenaLeave } from './arena.leave.app';
import { arenaList } from './arena.list.app';
import { ArenaSession } from './arena.types';
import { arenaCheckMember } from './shared/arena.check-member';
import { arenaGetValid } from './shared/arena.get-valid';
import { updateArenaTitle } from './shared/arena.update-list';

class ArenaJoin extends AppCommand {
    trigger = '加入';

    help = '仅可通过按钮加入';
    func: AppFunc<ArenaSession> = async (session: ArenaSession) => {
        const [msg, args] = [session.msg, session.args as string[]];

        // if (msg.mention.user.length != 1) {
        //     session.reply(this.help);
        // }
        // if (!session.user.roles.includes(15186))
        //     return session.mentionTemp(
        //         '你好像还是临时用户……请点击左上角切换至欢迎频道，点击“开始使用”。'
        //     );
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
                leaveMessage = `已退出${arena.nickname}的房间。`;
            }
        });
        console.log('queue:', arena.member);
        if (!arena.member) {
            arena.member = [];
        }
        arena.member.push({
            _id: session.user.id,
            nickname: session.user.username,
        });
        arena.isNew = false;
        arena.markModified('member');
        await arena.save();
        arenaList.func(session);
        return session.mentionTemp(
            ''.concat(
                leaveMessage,
                `\n欢迎加入${arena.nickname}的房间！`,
                `\n房间号：${arena.code}，房间密码：${arena.password}`
            )
        );
    };
}

export const arenaJoin = new ArenaJoin();
