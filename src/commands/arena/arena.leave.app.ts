import { AppCommand, AppFunc } from 'kbotify';
import Arena, { ArenaDoc } from '../../models/Arena';
import { ArenaSession } from './arena.types';
import { arenaGetValid } from './shared/arena.get-valid';
import { updateArenaTitle } from './shared/arena.update-list';

class ArenaLeave extends AppCommand {
    trigger = '退出';
    func: AppFunc<ArenaSession> = async (session: ArenaSession) => {
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
            content += `\`${a.nickname}的房间\`\n`;
        }
        updateArenaTitle();
        return session.replyTemp(content);
    };
    leave = async (arena: ArenaDoc, khlId: string) => {
        const result = await Arena.updateOne(
            { _id: arena._id },
            { $pull: { member: { _id: khlId } } }
        );
        console.debug(result);
    };
}

export const arenaLeave = new ArenaLeave();
