import { AppCommand, AppFunc, BaseSession, GuildSession } from 'kbotify';

import { checkRoles } from './shared/training.checkroles';

import { parseCard } from '../../utils/card-parser';
import { channel } from '../../configs';

import TrainingArena, { TrainingArenaDoc } from '../../models/TrainingArena';
import { formatTime } from '../../utils/format-time';
import { trainingInfoCard } from './card/training.info.card';

class TrainingCreate extends AppCommand {
    code = 'create';
    trigger = '创建';
    help =
        '创建教练房命令格式：\n`.教练房 创建 开始时间 连接方式 人数限制 留言`\n开始时间请用`小时：分钟`表示，如需其他日期请提前联系冰飞修改。\n如：`.房间 特训 18:00 裸连 5人 今天新手专场`';
    func: AppFunc<BaseSession> = async (s: BaseSession) => {
        const session = s as GuildSession;
        // console.log('receive create training', session);
        //.教练房 创建 76VR2 147 裸连 5 随意
        // error handling
        if (!checkRoles((await session.user.full()).roles, 'coach')) {
            return session.replyTemp('权限不足，只有教练组可以发起特训房。');
        }
        if (!session.args.length) {
            return session.sendTemp(this.help);
        } else if (session.args.length !== 4) {
            // no args found, return menu
            return session.replyTemp('参数数量错误' + this.help);
        }

        const arena = await this.createTrainingArena(session);

        // const limit = argsCheckerToLimit(session.args);
        // if (typeof limit === 'undefined')
        //     return session.replyTemp(
        //         '参数格式错误。请检查房间号、密码，并确认加速、人数文字长度小于8'
        //     );

        // start creating
        // const arena = await trainingUpsert(session, limit);
        // console.debug(arena);
        if (!arena)
            throw new Error(
                'Upsert should return an arena when creating training arena.'
            );

        const result = await session._send(trainingInfoCard(arena), undefined, {
            channel: channel.arenaBot,
            msgType: 10,
        });
        if (result.msgSent) {
            arena.card = result.msgSent.msgId;
            arena.save();
        }
        return result;
    };

    createTrainingArena(session: BaseSession): Promise<TrainingArenaDoc> {
        let time, connection, limit, remark;
        try {
            time = parseTime(session.args[0]);
            connection = session.args[1];
            limit = session.args[2].match(/\d+/)![0];
            remark = session.args[3];
        } catch (error) {
            session.replyTemp('参数有误');
            throw error;
        }
        return TrainingArena.findByIdAndUpdate(
            session.userId,
            {
                nickname: session.user.username,
                avatar: session.user.avatar,
                limit: parseInt(limit),
                queue: [],
                connection: connection,
                info: remark,
                startAt: time,
                createdAt: new Date(),
                register: true,
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );
    }
}

export const trainingCreate = new TrainingCreate();

function parseTime(str: string) {
    const time = str.split(/[:：]/);
    const date = new Date();
    date.setHours(parseInt(time[0]));
    date.setMinutes(parseInt(time[1]));
    return date;
}
