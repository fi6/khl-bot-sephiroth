import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify';
import configs, { channels } from '../../configs';
import TrainingArena, { TrainingArenaDoc } from '../../models/TrainingArena';
import { trainingManageCard } from './card/training.manage.card';

import { queueManager } from './shared/training.queue-manager';
import { log } from '../../init/logger';
import { arenaManage } from '../arena/arena.manage.app';

class TrainingManage extends AppCommand {
    trigger = '管理';
    help =
        '发送`.房间 管理`获取特训房内的排队列表及每个人的编号。\n如需将人移出队伍请输入`.房间 移除 对应编号`';

    constructor() {
        super();
    }

    func: AppFunc<BaseSession> = async (s: BaseSession) => {
        const session = await GuildSession.fromSession(s);

        // find arena
        const arena = await TrainingArena.findOne({
            _id: session.userId,
        }).exec();

        // no arena found
        if (!arena) {
            return session.mentionTemp('没有找到可管理的教练房');
        }

        if (!session.args.length) return this.sendManageCard(session, arena);
        else if (session.args[0] == 'close')
            return arenaManage.close(session, arena);
        else if (session.args[0] == 'kick' && session.args.length == 2) {
            return this.kick(session, arena);
        } else if (session.args[0] == 'join' && session.args.length == 2) {
            // register related: on/off
            if (session.args[1] == '1') {
                arena.join = true;
                return this.sendManageCard(session, arena, '已启动排队');
            } else if (session.args[1] == '0') {
                arena.join = false;
                return this.sendManageCard(session, arena, '已停止排队');
            }
        } else if (session.args[0] == 'call') {
            // call related: call next / call number
            const user: TrainingArenaDoc['queue'][number] =
                queueManager.callNext(arena);
            this.sendManageCard(session, arena, '已呼叫' + user.nickname);
            return;
        } else if (session.args[0] == 'info') {
            // input arena info

            session.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText(
                    '请在60秒内输入房间号、房间密码、房间信息，用空格分开\n如：65FC2 147 裸连4人'
                ),
            ]);

            const inputMsg = await session.awaitMessage(/^\w{5} +\d{0,8}/, 6e4);

            if (!inputMsg) {
                return session.replyTemp('未收到输入，请重试');
            }
            inputMsg.delete();
            this.updateInfo(arena, inputMsg.content);
            return session.updateMessageTemp(configs.arena.mainCardId, [
                new Card().addText(
                    `房间信息已更新为：${arena.code} ${arena.password} ${arena.info}`
                ),
            ]);
        }
    };

    kick = async (session: GuildSession, arena: TrainingArenaDoc) => {
        const args = session.args;
        try {
            let user: TrainingArenaDoc['queue'][number];
            if (args[1] == 'next') {
                user = queueManager.kickNext(arena);
            } else {
                user = queueManager.kick(args[1], arena);
            }
            // updateTraininginfo(arena);
            this.sendManageCard(session, arena, `已移出` + user.nickname);
            queueManager._remind(user._id, [
                new Card().addText(
                    '你被教练移出房间了……如果结束后没有主动点击退出，下次请记得点击哦'
                ),
            ]);
        } catch (error) {
            log.error(error, session);
            session.send('出现错误: ' + error.message);
        }
    };

    sendManageCard(
        session: GuildSession,
        arena: TrainingArenaDoc,
        content?: string
    ) {
        session.updateMessageTemp(configs.arena.mainCardId, [
            ...(content
                ? [new Card().addText(content).setTheme('warning')]
                : []),
            ...trainingManageCard(arena),
        ]);
    }

    updateInfo(arena: TrainingArenaDoc, content: string) {
        const info = content.split(/ +/);
        arena.code = info[0].toUpperCase();
        arena.password = info[1];
        arena.info = info[2];
        arena.save();
    }

    // callId = (arena: TrainingArenaDoc, id: string) => {
    //     const user = arena.queue.find((usr) => {
    //         return usr._id == id;
    //     });
    //     if (!user) {
    //         throw new Error('no user in that id found');
    //     }
    //     this._callUser(arena, user);
    //     return user;
    // };
}

export const trainingManage = new TrainingManage();
