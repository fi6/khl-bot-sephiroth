import { AppCommand } from 'kbotify';
import { FuncResult, ResultTypes } from 'kbotify';
import Arena from 'models/Arena';
import { ArenaSession } from './arena.types';

class ArenaDelete extends AppCommand {
    code = 'delete';
    trigger = '关闭';
    help = '如需关闭房间，请输入\n`.关房`';
    intro = '';
    func = async (
        session: ArenaSession
    ): Promise<FuncResult<ArenaSession> | ResultTypes> => {
        try {
            session.arena = await Arena.findByIdAndDelete(
                session.msg.authorId
            ).exec();
            if (!session.arena) {
                return session.reply(`未找到可删除的房间。`);
            }
            return session.reply(`房间\`${session.arena.arenaId}\`已删除。`);
        } catch (e) {
            console.error('Error when deleting arena', e, session);
            // data.result_status = ArenaResultStatus.error;
            // data.result.details = e;
            return session.reply(
                '关闭房间时发生未知错误。请联系作者改bug(ಥ_ಥ)'
            );
        }
    };
}

export const arenaDelete = new ArenaDelete();
