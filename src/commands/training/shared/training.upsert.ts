import { ArenaSession } from 'commands/arena/arena.types';
import { TextMessage } from 'kaiheila-bot-root/dist/types';
import Arena, { ArenaDoc } from 'models/Arena';

export async function trainingUpsert(
    session: ArenaSession,
    limit: string
): Promise<ArenaDoc> {
    return Arena.findByIdAndUpdate(
        session.userId,
        {
            nickname: session.user.username,
            code: session.args[0].toUpperCase(),
            password: session.args[1],
            arenaInfo: session.args[2],
            isTraining: true,
            trainingLimit: parseInt(limit),
            trainingQueue: [],
            remark: session.args[4],
            createdAt: new Date(),
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );
}
