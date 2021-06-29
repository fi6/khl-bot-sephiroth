import { AppCommand, AppFunc, BaseSession, GuildSession } from 'kbotify';
import { channels } from '../../configs';
import TrainingArena, { TrainingArenaDoc } from '../../models/TrainingArena';
import { parseCard } from '../../utils/card-parser';
import { trainingManageCard } from './card/training.manage.card';
import { trainingCallCard } from './card/training.call.card';
import { trainingArenaSort } from './shared/training.arena-sort';
import { trainingCallManager } from './shared/training.call.manager';
import { updateTraininginfo } from './shared/training.update-info';
import { Error } from 'mongoose';
import { userInfo } from 'os';

class TrainingManage extends AppCommand {
    trigger = '管理';
    help =
        '发送`.房间 管理`获取特训房内的排队列表及每个人的编号。\n如需将人移出队伍请输入`.房间 移除 对应编号`';

    constructor() {
        super();
        trainingCallManager.on(
            'fail',
            async (arenaId: string, userId: string) => {
                const arena = await TrainingArena.findOne({
                    _id: arenaId,
                }).exec();
                if (!arena) return;
                if (this.kick(userId, arena)) {
                    this._remind(
                        userId,
                        '没有在规定时间内加入语音频道并签到……你的教练房排队已取消'
                    );
                    this.callNext(arena);
                }
            }
        );
    }
    func: AppFunc<BaseSession> = async (s: BaseSession) => {
        if (!(s instanceof GuildSession)) return;
        const session = s as GuildSession;
        const [msg, args] = [session.msg, session.args];

        // find arena
        const arena = await TrainingArena.findOne({
            _id: session.userId,
        }).exec();

        // no arena found
        if (!arena) {
            return session.mentionTemp('没有找到可管理的教练房');
        }

        if (!session.args.length) this.sendManageCard(session, arena);
        else if (session.args[0] == 'kick' && session.args.length == 2) {
            try {
                if (args[1] == 'next') {
                    const user = this.kickNext(arena);
                    this._remind(
                        user._id,
                        '你被移出教练房啦……下次记得结束后主动点击退出哦'
                    );
                    updateTraininginfo(arena);
                    return this.sendManageCard(
                        session,
                        arena,
                        `已移出` + user.nickname
                    );
                }
                if (this.kick(args[1], arena)) {
                    this._remind(
                        args[1],
                        '你被教练移出教练房啦……下次记得结束后主动点击退出哦'
                    );
                    updateTraininginfo(arena);
                    return this.sendManageCard(session, arena, `已移出`);
                } else {
                    return session.sendTemp('remove failed');
                }
            } catch (error) {
                console.error(error, session);
                session.send('出现未知错误……在反馈频道发送问题试试看吧');
            }
        } else if (session.args[0] == 'register' && session.args.length == 2) {
            // register related: on/off

            if (session.args[1] == 'on') {
                arena.register = true;
                updateTraininginfo(arena);
                return this.sendManageCard(session, arena, '已开启注册');
            } else if (session.args[1] == 'off') {
                arena.register = false;
                updateTraininginfo(arena);
                return this.sendManageCard(session, arena, '已关闭注册');
            }
        } else if (session.args[0] == 'call') {
            // call related: call next / call number

            let user: TrainingArenaDoc['queue'][number];
            if (!(args.length >= 1)) user = this.callNext(arena);
            else user = this.callId(arena, args[1]);
            this.sendManageCard(session, arena, '已呼叫' + user.nickname);
            return;
        } else if (session.args[0] == 'info') {
            // input arena info

            session.mentionTemp(
                '请在60秒内输入房间号、房间密码，用空格分开\n如：65FC2 147'
            );

            const inputMsg = await session.awaitMessage(/^\w{5} +\d{0,8}/, 6e4);

            if (!inputMsg) {
                return session.replyTemp('未收到输入，请重试');
            }
            this.inputInfo(arena, inputMsg?.content);
            this.client?.API.message.delete(inputMsg.msgId);
            return session.replyTemp(
                `房间信息已更新为：${arena.code} ${arena.password}\n连接方式：${arena.connection}`
            );
        }
    };

    kickNext(arena: TrainingArenaDoc) {
        let nextUser;
        trainingArenaSort(arena);
        for (const user of arena.queue) {
            if (user.state && user.state >= 0) {
                nextUser = user;
                break;
            }
        }
        if (!nextUser) throw new Error('no next user');

        this.kick(nextUser?._id, arena);
        return nextUser;
    }

    kick(userId: string, arena: TrainingArenaDoc) {
        const user = arena.queue.find((usr) => {
            return usr._id === userId && usr.state !== -1;
        });
        if (!user) {
            return false;
        }
        user.state = -1;
        arena.markModified('queue');
        arena.save();
        return true;
    }

    sendManageCard(
        session: GuildSession,
        arena: TrainingArenaDoc,
        content?: string
    ) {
        session.sendCardTemp(parseCard(trainingManageCard(arena, content)));
    }

    inputInfo(arena: TrainingArenaDoc, content: string) {
        const info = content.split(/ +/);
        arena.code = info[0];
        arena.password = info[1];
        arena.save();
    }

    callId = (arena: TrainingArenaDoc, id: string) => {
        const user = arena.queue.find((usr) => {
            return usr._id == id;
        });
        if (!user) {
            throw new Error('no user in that id found');
        }
        this._callUser(arena, user);
        return user;
    };

    callNext = (arena: TrainingArenaDoc) => {
        let nextUser;
        trainingArenaSort(arena);
        for (const user of arena.queue) {
            if (user.state == 0) {
                nextUser = user;
                break;
            }
        }
        if (!nextUser) throw new Error('no next user');
        // call user
        this._callUser(arena, nextUser);
        return nextUser;
    };

    _callUser = (arena: TrainingArenaDoc, user: any) => {
        user.state = 1;
        arena.markModified('queue');
        this._remind(
            user._id,
            parseCard(trainingCallCard(arena, user._id)),
            10
        );
        trainingCallManager.call(user._id);
        updateTraininginfo(arena);
    };

    _remind(userId: string, content: string, type = 9) {
        this.client?.API.message.create(
            type,
            channels.chat,
            `(met)${userId}(met) ${content}`
        );
        this.client?.API.message.create(
            type,
            channels.arenaBot,
            `${content}`,
            undefined,
            userId
        );
    }
}

export const trainingManage = new TrainingManage();
