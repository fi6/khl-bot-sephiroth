import Arena from '../../models/Arena';
import { arenaMsgBuilder } from './arena-msg';
import arenaConfig from '../../configs/arena';
import { checkRoles } from '../../utils/utils';
import { ArenaCommandStatus, ArenaData } from './arena-helper';

async function arenaCreate(data: ArenaData): Promise<ArenaData> {
    data.command = 'create';
    const arenaReg = /^\w{5}$/;
    const passReg = /^\d{0,8}$/;
    const args = data.args;
    const msg = data.msg;

    let remark = '';
    if (args.length < 3) {
        // no args found, return menu
        data.result.status = ArenaCommandStatus.help;
        data.content = await arenaMsgBuilder(data);
        return data;
    }

    if (
        !arenaReg.test(args[0]) ||
        !passReg.test(args[1]) ||
        args[2].length > 7
    ) {
        data.content = await arenaMsgBuilder(data);
        return data;
    }

    const [arenaId, password, arenaInfo] = [
        args[0].toUpperCase(),
        args[1],
        args[2],
    ];

    if (args.length === 4) {
        remark = args[3];
    } else {
        remark = '';
    }

    await Arena.findByIdAndUpdate(
        msg.authorId,
        {
            userNick: msg.author.nickname,
            arenaId: arenaId,
            password: password,
            arenaInfo: arenaInfo,
            remark: remark,
            isTraining: false,
            createdAt: new Date(),
        },
        {
            upsert: true,
        }
    );
    data.result.status = ArenaCommandStatus.success;
    data.content =
        (await arenaMsgBuilder(data)) + '\n' + (await arenaFind(data)).content;
    return data;
}

async function arenaFind(data: ArenaData): Promise<ArenaData> {
    data.command = 'find';
    const arenaExpireTime = new Date(
        new Date().valueOf() - arenaConfig.validTime
    );
    try {
        const arenas = await Arena.find({
            createdAt: {
                $gte: arenaExpireTime,
            },
        })
            .sort([
                ['isTraining', -1],
                ['createdAt', -1],
            ])
            .exec();
        if (arenas.length == 0) {
            data.content = await arenaMsgBuilder(data);
        } else {
            data.content = await arenaMsgBuilder(data);
        }
        return data;
    } catch (e) {
        console.log(e);
        data.result.status = 'ERROR';
        data.result.details = e;
        return data;
    }
    // console.log(arenas)
}

/**
 *
 * @param data
 */
async function arenaDelete(data: ArenaData): Promise<ArenaData> {
    data.command = 'delete';
    try {
        const arena = Arena.findByIdAndDelete(data.msg.authorId).exec();
        if (!arena) {
            data.result.status = ArenaCommandStatus.no_arena;
            data.content = await arenaMsgBuilder(data);
        } else {
            data.result.status = ArenaCommandStatus.success;
            data.content = await arenaMsgBuilder(data);
        }
        return data;
    } catch (e) {
        console.log(e);
        data.result.status = ArenaCommandStatus.error;
        data.result.details = e;
        return data;
    }
}

/**
 * Braodcast an arena to #Arena channel.
 *
 * @param data data in the pipeline
 * @return {*}
 */
async function arenaAlert(data: ArenaData): Promise<ArenaData> {
    data.command = 'alert';

    let timeLimit;
    if (checkRoles(data.msg.author, 'up')) {
        timeLimit = 10 * 6e4;
    } else {
        timeLimit = 30 * 6e4;
    }
    // check args
    if (data.args.length != 1) {
        data.result.status = ArenaCommandStatus.help;
        data.content = await arenaMsgBuilder(data);
        return data;
    }
    // --------find profile--------
    // let profile = Profile.findById(msg.authorId).exec();
    // if (!profile.length) {
    //     return sendMsg('alert', 'no_account', [msg])
    // }
    // // time limit
    // if (Date.now() - profile.alertUsedAt < timeLimit) {
    //     return sendMsg('alert', 'time_limit', [msg])
    // }
    // find arena for alert
    const arena = await Arena.findById(data.msg.authorId).exec();
    if (!arena) {
        data.result.status = ArenaCommandStatus.no_arena;
        data.content = await arenaMsgBuilder(data);
        return data;
    }
    // --------alert--------
    // Profile.findByIdAndUpdate(msg.authorId, { alertUsedAt: Date.now() }, (err, res) => {
    //     if (err) {
    //         console.error(err);
    //         return sendMsg('alert', 'error')
    //     }
    //     return sendMsg('alert', 'success', [msg, arena, args]);
    // })
    data.result.status = ArenaCommandStatus.success;
    data.content = await arenaMsgBuilder(data);
    return data;
}

export { arenaCreate, arenaFind, arenaDelete, arenaAlert };
