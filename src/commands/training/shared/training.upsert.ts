import { ArenaSession } from 'commands/arena/arena.types';
import { TextMessage } from 'kaiheila-bot-root/dist/types';
import Arena, { ArenaDoc } from 'models/Arena';
import TrainingArena from '../../../models/TrainingArena';

export async function trainingUpsert(
    session: ArenaSession,
    limit: string
): Promise<ArenaDoc> {
    //.教练房 创建 76VR2 147 裸连 5 随意
    return TrainingArena.findByIdAndUpdate(
        session.userId,
        {
            nickname: session.user.username,
            code: session.args[0].toUpperCase(),
            password: session.args[1],
            info: session.args[2],
            limit: parseInt(limit),
            queue: [],
            remark: session.args[4],
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
