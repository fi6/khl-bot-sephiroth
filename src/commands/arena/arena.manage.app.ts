import { AppCommand } from 'kbotify';
import { FuncResult, ResultTypes } from 'kbotify';
import Arena from 'models/Arena';
import { ArenaSession } from './arena.types';
import { arenaManageCard } from './card/arena.manage.card';

class ArenaManage extends AppCommand {
    code = 'manage';
    trigger = '管理';
    help = '如需关闭房间，请输入\n`.关房`';
    intro = '';
    func = async (
        session: ArenaSession
    ): Promise<FuncResult<ArenaSession> | ResultTypes> => {
        session.arena = await Arena.findById(session.user.id).exec();
        if (!session.arena) {
            return session.replyTemp(
                `未找到可管理的房间。如需创建房间，可发送\`.建房\``
            );
        }
        if (session.args[0] == '关闭') {
            return this.delete(session);
        }
        return session.sendCardTemp(JSON.stringify(arenaManageCard(session)));
    };

    private delete = async (session: ArenaSession) => {
        try {
            if (!session.arena) {
                return session.reply(`未找到可删除的房间。`);
            }
            await Arena.findByIdAndDelete(session.user.id).exec();
            return session.reply(`房间\`${session.arena.arenaId}\`已关闭。`);
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

export const arenaManage = new ArenaManage();
