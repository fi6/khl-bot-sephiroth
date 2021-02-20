import { ArenaSession } from 'commands/arena/arena.types';
import { TextMessage } from 'kaiheila-bot-root/dist/types';
import Arena, { ArenaDoc } from 'models/Arena';

export async function trainingUpsert(
    data: ArenaSession,
    limit: string
): Promise<ArenaDoc> {
    return Arena.findByIdAndUpdate(
        data.msg.authorId,
        {
            userNick: data.msg.author.nickname,
            arenaId: data.args[0].toUpperCase(),
            password: data.args[1],
            arenaInfo: data.args[2],
            isTraining: true,
            trainingLimit: parseInt(limit),
            trainingQueue: [],
            remark: data.args[4],
            createdAt: new Date(),
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );
}
