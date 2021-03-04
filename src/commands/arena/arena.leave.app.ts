import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena, { ArenaDoc } from '../../models/Arena';
import { ArenaSession } from './arena.types';
import { arenaGetValid } from './shared/arena.get-valid';

class ArenaLeave extends AppCommand {
    trigger = '退出';
    func: AppCommandFunc<ArenaSession> = async (session: ArenaSession) => {
        if (!session.args.length)
            session.arenas = await Arena.find({
                'member._id': session.userId,
            }).exec();
        else
            session.arenas = await Arena.find({
                _id: session.args[0],
            }).exec();
        if (!session.arenas.length) {
            return session.replyTemp('没有找到可退出的房间。');
        }
        try {
            session.arenas.forEach(async (a) => {
                this.leave(a, session.userId);
            });
        } catch (error) {
            console.error(error);
            return session.sendTemp('出现未知错误');
        }
        let content = '已离开：\n';
        for (const a of session.arenas) {
            content += `\`${a.userNick}的房间\`\n`;
        }
        return session.replyTemp(content);
    };
    leave = (arena: ArenaDoc, khlId: string) => {
        Arena.updateOne(
            { _id: arena._id },
            { $pull: { member: { _id: khlId } } }
        );
    };
}

export const arenaLeave = new ArenaLeave();
