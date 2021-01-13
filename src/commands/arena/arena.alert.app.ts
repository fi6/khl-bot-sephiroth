import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena from 'models/Arena';
import { checkRoles } from 'utils/check-roles';
import { ArenaData } from './arena.types';
import { arenaAlertMsg } from './shared/arena.alert.msg';

class ArenaAlert extends AppCommand<ArenaData> {
    code = 'alert';
    trigger = '广播';
    help = '';
    intro = '';
    func: AppCommandFunc<ArenaData> = async (data) => {
        let timeLimit;
        if (checkRoles(data.msg.author.roles, 'up')) {
            timeLimit = 10 * 6e4;
        } else {
            timeLimit = 30 * 6e4;
        }
        // check args
        if (data.args.length > 1) {
            return this.msgSender.reply(this.help, data);
        }
        // --------find profile--------
        // let profile = Profile.findById(msg.authorId).exec();
        // if (!profile.length) {
        //     return sendMsg('alert', 'no_account', [msg])
        // }
        // // time limit
        // if (Date.now() - profile.alertUsedAt < timeLimit) {
        //     return sendMsg('alert', 'time_limit', [msg])
        // }
        // find arena for alert
        const arena = await Arena.findById(data.msg.authorId).exec();
        if (!arena)
            return this.msgSender.reply(
                '没有找到可广播的房间。请先创建房间。',
                data
            );
        // --------alert--------
        // Profile.findByIdAndUpdate(msg.authorId, { alertUsedAt: Date.now() }, (err, res) => {
        //     if (err) {
        //         console.error(err);
        //         return sendMsg('alert', 'error')
        //     }
        //     return sendMsg('alert', 'success', [msg, arena, args]);
        // })
        return this.msgSender.send(arenaAlertMsg(data), data);
    };
}

export const arenaAlert = new ArenaAlert();
