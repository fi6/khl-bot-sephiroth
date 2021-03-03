import { AppCommand, AppCommandFunc, BaseSession } from 'kbotify';
import Arena from 'models/Arena';
import { checkRoles } from 'utils/check-roles';
import { ArenaSession } from './arena.types';
import { arenaAlertCard, arenaAlertHelper } from './card/arena.alert.card';
import LRUCache from 'lru-cache';

class ArenaAlert extends AppCommand {
    code = 'alert';
    trigger = '广播';
    help = '';
    intro = '';
    cache = new LRUCache<string, () => void>({ maxAge: 90 * 1e3 });
    func: AppCommandFunc<ArenaSession> = async (session) => {
        let timeLimit;
        // if (checkRoles(session.msg.author.roles, 'up')) {
        //     timeLimit = 10 * 6e4;
        // } else {
        //     timeLimit = 30 * 6e4;
        // }
        // check args
        const arena = await Arena.findById(session.user.id).exec();
        if (!arena)
            return session.replyTemp(
                '没有找到可广播的房间。请先发送`.建房`创建房间。'
            );
        if (!session.args.length) {
            let cancel_handle = session.setReplyTrigger('', 60 * 1e3, (msg) => {
                this.func(new BaseSession(this, [msg.content], msg));
            });
            this.cache.set(session.userId, cancel_handle);
            return session.sendCardTemp(arenaAlertHelper());
        }
        if (session.args[0] == 'cancel') {
            let cancel_handle = this.cache.get(session.userId);
            if (!cancel_handle) {
                return session.sendTemp('出错了，不能取消……你好像没有在广播？');
            }
            cancel_handle();
            return session.sendTemp('取消成功');
        }
        // --------find profile--------
        // let profile = Profile.findById(session.userId).exec();
        // if (!profile.length) {
        //     return sendMsg('alert', 'no_account', [msg])
        // }
        // // time limit
        // if (Date.now() - profile.alertUsedAt < timeLimit) {
        //     return sendMsg('alert', 'time_limit', [msg])
        // }
        // find arena for alert

        // --------alert--------
        // Profile.findByIdAndUpdate(session.userId, { alertUsedAt: Date.now() }, (err, res) => {
        //     if (err) {
        //         console.error(err);
        //         return sendMsg('alert', 'error')
        //     }
        //     return sendMsg('alert', 'success', [msg, arena, args]);
        // })
        await session.send(
            `(met)all(met) ${arena.userNick} 的房间正在寻找小伙伴加入！\n留言：${session.args[0]}`
        );
        // sleep for 300 ms
        await new Promise((resolve) => setTimeout(resolve, 50));
        return await session.sendCard(arenaAlertCard(arena));
    };
}

export const arenaAlert = new ArenaAlert();
