import { ArenaSession } from 'commands/arena/arena.types';
import bot from 'init/bot_init';
import { AppCommand, AppCommandFunc } from 'kbotify';
import { ResultTypes } from 'kbotify';
import Arena from 'models/Arena';
import { checkRoles } from 'utils/check-roles';

class KickTraining extends AppCommand<ArenaSession> {
    trigger = '移除';
    help =
        '如需移除队伍中的玩家，请输入\n`.房间 移除 玩家编号`\n如需移除多个，可用逗号隔开。当前队伍和玩家编号可输入`.房间 管理`查看。';
    func: AppCommandFunc<ArenaSession> = async (data: ArenaSession) => {
        const [msg, args] = [data.msg, data.args];
        if (!checkRoles(msg.author.roles, 'coach')) {
            return this.msgSender.reply(
                '权限不足，只有教练组可以发起和管理特训房',
                data
            );
        }
        const arena = await Arena.findOne({
            _id: msg.authorId,
            isTraining: true,
        }).exec();
        if (!arena) {
            return this.msgSender.reply('没有找到可管理的特训房', data);
        }
        data.arena = arena;
        if (!args[0]) {
            return this.msgSender.reply(this.help, data);
        } else if (args[0] == 'all') {
            return this.msgSender.reply('尚未完工', data);
            //     return 'clear all, not finished';
        }
        try {
            data.other = [] as string[];
            for (const tag of args[0].split(/[,，]/)) {
                const user = arena.trainingQueue.find((usr) => {
                    return usr.tag?.toString() === tag;
                });
                if (!user) {
                    throw new Error('user not found');
                }
                data.other = await Arena.updateOne(
                    { _id: arena._id },
                    { $pull: { trainingQueue: { tag: tag } } }
                );
                data.other.push(user._id);
            }

            // arena.markModified('trainingQueue');
            // await arena.save();
        } catch (error) {
            console.error(error, data);
            return this.msgSender.send(
                '出现未知错误啦！',
                data,
                ResultTypes.ERROR
            );
        }
        let content = '';
        data.other.forEach((id: string) => {
            content += `(met)${id}(met) `;
        });
        content += `你已被移出\`${msg.author.nickname}的特训房\` 的队伍。\n> 多次不主动退出的话会暂时禁止参加特训。`;
        setTimeout(() => {
            bot.sendChannelMessage(9, msg.channelId, content);
        }, 2 * 1e3);
        return this.msgSender.reply('操作成功！', data);
    };
}
