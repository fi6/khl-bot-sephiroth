import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify';
import Arena, { ArenaDoc } from 'models/ArenaLegacy';
import configs, { channels } from '../../configs';
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
                leaveMessage = `已退出${arena.nickname}的房间。\n`;
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
        arena._empty = false;
        arena.isNew = false;
        arena.markModified('member');
        await arena.save();
        updateArenaTitle();
        if (arena.memberCount() >= arena.limit) this.remindHost(arena);
        session._send(
            `语音房间链接：${arena.invite}\n点击下方按钮即可加入，也可以分享链接给群友一起聊天～`,
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
    remindHost = async (arena: ArenaDoc, full = true) => {
        this.client?.API.message.create(
            9,
            channels.chat,
            `(met)${arena.id}(met) 房间似乎已满……请点击管理房间-暂停加入。`,
            undefined,
            arena.id
        );
    };
}

export const arenaJoin = new ArenaJoin();
