import { AppCommand } from 'kbotify';
import { FuncResult, ResultTypes } from 'kbotify/dist/commands/shared/types';
import Arena from 'models/Arena';
import { ArenaData } from './arena.types';

class ArenaDelete extends AppCommand<ArenaData> {
    code = 'delete';
    trigger = '关闭';
    help = '如需关闭房间，请输入\n`.关房`';
    intro = '';
    func = async (
        data: ArenaData
    ): Promise<FuncResult<ArenaData> | ResultTypes> => {
        try {
            data.arena = await Arena.findByIdAndDelete(
                data.msg.authorId
            ).exec();
            if (!data.arena) {
                return this.msgSender.reply(`未找到可删除的房间。`, data);
            }
            return this.msgSender.reply(
                `房间\`${data.arena.arenaId}\`已删除。`,
                data
            );
        } catch (e) {
            console.error('Error when deleting arena', e, data);
            // data.result_status = ArenaResultStatus.error;
            // data.result.details = e;
            return this.msgSender.reply(
                '关闭房间时发生未知错误。请联系作者改bug(ಥ_ಥ)',
                data
            );
        }
    };
}

export const arenaDelete = new ArenaDelete();
