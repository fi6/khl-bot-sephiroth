import { ArenaSession } from 'commands/arena/arena.types';
import { AppCommand, AppCommandFunc } from 'kbotify';
import Arena from 'models/Arena';
import { checkRoles } from 'utils/check-roles';
import { formatTime } from 'utils/format-time';

class TrainingManage extends AppCommand<ArenaSession> {
    trigger = '管理';
    help =
        '发送`.房间 管理`获取特训房内的排队列表及每个人的编号。\n如需将人移出队伍请输入`.房间 移除 对应编号`';
    func: AppCommandFunc<ArenaSession> = async (data: ArenaSession) => {
        const [msg, args] = [data.msg, data.args];

        // check if coach
        if (!checkRoles(msg.author.roles, 'coach')) {
            this.msgSender.reply(
                '权限不足，只有教练组可以发起和管理特训房',
                data
            );
        }

        // find arena
        data.arena = await Arena.findOne({
            _id: msg.authorId,
            isTraining: true,
        }).exec();

        // no arena found
        if (!data.arena) {
            return this.msgSender.reply('没有找到可管理的特训房', data);
        }

        // if (!args.length) {
        //     data.arena.trainingQueue.sort(dynamicSort('time'));
        //     for (const [i, user] of data.arena.trainingQueue.entries()) {
        //         user['tag'] = i + 1;
        //     }
        //     data.arena.markModified('trainingQueue');
        //     data.arena.save();

        // }
        let content = '';
        let queue = '';
        for (const user of data.arena.trainingQueue) {
            // console.log(user);
            queue += `${user.tag}. ${user.userNick}(${formatTime(
                user.time
            )})\n`;
        }
        content = ''.concat(
            '```markdown\n',
            `${msg.author.nickname}的特训房\n`,
            '当前排队：\n',
            queue,
            '如需移除请发送[.房间 移除 序号]```'
        );

        return this.msgSender.sendOnly(content, data);
    };
}
export const trainingManage = new TrainingManage();
