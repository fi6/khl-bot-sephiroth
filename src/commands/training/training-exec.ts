import { ArenaData } from 'commands/arena/arena-helper';
import { arenaMsgBuilder } from 'commands/arena/arena-msg';
import { TextMessage } from 'kaiheila-bot-root/dist/types';
import Arena, { ArenaDoc } from 'models/Arena';
import { checkRoles, dynamicSort } from 'utils/utils';
import { TrainingCommands, TrainingResultStatus } from './training-helper';
import { trainingMsgBuilder } from './training-msg';

/**
 * Create Training Arena, which set isTraining to true and initialize trainingQueue.
 *
 * @param data Arena data, same as arena commands.
 * @return {*}
 */
export async function createTraining(data: ArenaData): Promise<ArenaData> {
    // console.log('receive create training', data)
    const [msg, args] = [data.msg as TextMessage, data.args as string[]];

    const arenaReg = /^\w{5}$/;
    const passReg = /^\d{0,8}$/;

    // error handling
    if (!checkRoles(msg.author, 'coach')) {
        data.result_status = TrainingResultStatus.fail;
        data.content = await trainingMsgBuilder(data);
        return data;
    }
    if (!args.length) {
        data.result_status = TrainingResultStatus.help;
        return data.generateContent();
    } else if (args.length !== 5) {
        // no args found, return menu
        data.result_status = TrainingResultStatus.wrong_args_num;
        return data.generateContent();
    }
    const limit = /\d/.exec(args[3]) as RegExpExecArray;
    if (
        !arenaReg.test(args[0]) ||
        !passReg.test(args[1]) ||
        !limit ||
        args[2].length > 7
    ) {
        data.result_status = TrainingResultStatus.wrong_args;
        return data.generateContent();
    }

    // start creating

    data.arena = await Arena.findByIdAndUpdate(
        msg.authorId,
        {
            userNick: msg.author.nickname,
            arenaId: args[0].toUpperCase(),
            password: args[1],
            arenaInfo: args[2],
            isTraining: true,
            trainingLimit: parseInt(limit[0]),
            trainingQueue: [],
            remark: args[4],
            createdAt: new Date(),
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );
    data.result_status = TrainingResultStatus.success;
    return data.generateContent();
}

export async function joinTraining(data: ArenaData): Promise<ArenaData> {
    const [msg, args] = [data.msg as TextMessage, data.args as string[]];

    if (msg.mention.user.length != 1) {
        data.result_status = TrainingResultStatus.help;
        return data.generateContent();
    }
    data.arena = await Arena.findOne({
        _id: msg.mention.user[0],
        isTraining: true,
    }).exec();
    if (!data.arena) {
        data.result_status = TrainingResultStatus.no_arena;
        return data.generateContent();
    }
    for (const user of data.arena.trainingQueue) {
        if (user._id == msg.authorId) {
            data.result_status = TrainingResultStatus.in_queue;
            return data.generateContent();
        }
    }
    data.arena.trainingQueue.push({
        _id: msg.authorId,
        userNick: msg.author.nickname,
        time: new Date(),
    });
    data.arena.isNew = false;
    data.arena.markModified('trainingQueue');
    await data.arena.save();

    data.result_status = TrainingResultStatus.success;
    return data.generateContent();
}

export async function leaveTraining(data: ArenaData): Promise<ArenaData> {
    const msg = data.msg;
    if (!msg.mention.user.length) {
        data.arenas = await Arena.find({
            'trainingQueue._id': msg.authorId,
        }).exec();
        // console.log(arenas);
    } else {
        data.arenas = [
            await Arena.findById(msg.mention.user[0]).exec(),
        ] as typeof data.arenas;
    }
    if (!data.arenas) {
        data.result_status = TrainingResultStatus.no_arena;
        return data.generateContent();
    }
    try {
        data.arenas.forEach(async (a) => {
            await Arena.updateOne(
                { _id: a?._id },
                { $pull: { trainingQueue: { _id: msg.authorId } } }
            );
        });
    } catch (error) {
        console.error(error);
        data.result_status = TrainingResultStatus.error;
        return data.generateContent();
    }
    data.result_status = TrainingResultStatus.success;
    return data.generateContent();
}

export async function manageTraining(data: ArenaData): Promise<ArenaData> {
    const [msg, args] = [data.msg, data.args];

    // check if coach
    if (!checkRoles(msg.author, 'coach')) {
        data.result_status = TrainingResultStatus.fail;
        return data.generateContent();
    }

    // find arena
    data.arena = await Arena.findOne({
        _id: msg.authorId,
        isTraining: true,
    }).exec();

    // no arena found
    if (!data.arena) {
        data.result_status = TrainingResultStatus.no_arena;
        return data.generateContent();
    }

    if (!args.length) {
        data.arena.trainingQueue.sort(dynamicSort('time'));
        for (const [i, user] of data.arena.trainingQueue.entries()) {
            user['tag'] = i + 1;
        }
        data.arena.markModified('trainingQueue');
        data.arena.save();
        data.result_status = TrainingResultStatus.success;
    } else if (args[0] == 'all') {
        data.content = '尚未完工';
        //     return 'clear all, not finished';
    } else {
        data.content = '未知错误';
    }
    return data.generateContent();
}

/**
 * Kick user in the queue by tag generated in manageTraining.
 *
 * @export
 * @param data
 * @return {*}
 */
export async function kickTraining(data: ArenaData): Promise<ArenaData> {
    const [msg, args] = [data.msg, data.args];
    if (!checkRoles(msg.author, 'coach')) {
        data.result_status = TrainingResultStatus.fail;
        return data.generateContent();
    }
    const arena = await Arena.findOne({
        _id: msg.authorId,
        isTraining: true,
    }).exec();
    if (!arena) {
        data.result_status = TrainingResultStatus.no_arena;
        return data.generateContent();
    }

    const user = arena.trainingQueue.find((user) => {
        return user.tag?.toString() === args[0];
    });
    // console.log(user);
    data.result.details = await Arena.updateOne(
        { _id: arena._id },
        { $pull: { trainingQueue: { tag: args[0] } } }
    );
    arena.markModified('trainingQueue');
    await arena.save();
    data.arena = arena;
    data.result_status = TrainingResultStatus.success;
    return data.generateContent();
}

export async function helpTraining(data: ArenaData): Promise<ArenaData> {
    data.commandCode = TrainingCommands.help;
    return data;
}

export {};
