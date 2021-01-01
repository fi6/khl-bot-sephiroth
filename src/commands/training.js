import Arena from '../models/Arena.js';
import bot from '../utils/bot_init.js';
import { findArenaMsg } from './arena.js'
import { formatTime, dynamicSort, checkRoles } from '../utils/utils.js'

async function trainingCommand(subCommand, args, msg) {
    let content = '';

    content = await exec(subCommand, msg);
    // if (content) {
    //     bot.sendChannelMessage(9, msg.channelId, content, msg.msgId);
    // }

    async function exec(subCommand, msg) {
        switch (subCommand) {
            case '特训': // <== .房间 特训 
                return createTrainingMsg(args, msg);
            case '管理':
                return manageTrainingMsg(args, msg);
            case '移除':
                return manageTrainingMsg(args, msg);
            case '排队':
                return joinTrainingMsg(args, msg);
            case '退出':
                return leaveTrainingMsg(args, msg);
            default:
                return await sendTrainingMsg('help', null, [msg]);
        }
    }
}

async function createTrainingMsg(args, msg) {
    // console.log('receive create training', args, msg)

    const arenaReg = /^\w{5}$/;
    const passReg = /^\d{0,8}$/;
    let arenaId, password, arenaInfo, limit;
    let remark = '';

    // error handling
    if (!checkRoles(msg.author, 'coach')) {
        return sendTrainingMsg('create', 'fail', [msg])
    }
    if (!args.length) {
        return sendTrainingMsg('help', null, [msg]);

    } else if (args.length !== 5) { // no args found, return menu
        return sendTrainingMsg('create', 'wrong_args', [msg])
    }
    if (!arenaReg.test(args[0]) || !passReg.test(args[1]) || args[2].length > 7) {
        return sendTrainingMsg('create', 'error', [msg]);
    }

    // start creating
    arenaId = args[0].toUpperCase();
    password = args[1];
    arenaInfo = args[2];
    limit = /\d/.exec(args[3])[0];
    remark = args[4];

    let arena = await Arena.findByIdAndUpdate(msg.authorId, {
        userNick: msg.author.nickname,
        arenaId: arenaId,
        password: password,
        arenaInfo: arenaInfo,
        isTraining: true,
        trainingLimit: limit,
        trainingQueue: [],
        remark: remark,
        createdAt: Date.now()
    }, {
        upsert: true,
        new: true
    })
    return sendTrainingMsg('create', 'success', [msg, arena])
}

async function joinTrainingMsg(args, msg) {
    // console.log('join', args, msg)
    if (msg.mention.user.length != 1) {
        return sendTrainingMsg('join', 'help', [msg]);
    }
    let arena = await Arena.findOne({ _id: msg.mention.user[0], isTraining: true }).exec()
    if (!arena) {
        return sendTrainingMsg('join', 'notFound', [msg]);
    }
    for (let user of arena.trainingQueue) {
        if (user._id == msg.authorId) {
            return sendTrainingMsg('join', 'alreadyJoin', [msg]);
        }
    }
    arena.trainingQueue.addToSet({
        _id: msg.authorId,
        userNick: msg.author.nickname,
        time: Date.now()
    })
    arena.isNew = false;
    arena.markModified('trainingQueue');
    await arena.save()
    return sendTrainingMsg('join', 'success', [msg, arena])
}

async function leaveTrainingMsg(args, msg) {
    let arenas;
    if (!msg.mention.user.length) {
        arenas = await Arena.find({ 'trainingQueue._id': msg.authorId }).exec();
        // console.log(arenas);
    } else {
        arenas = [await Arena.findById(msg.mention.user[0]).exec()];
    }
    if (!arenas.length) {
        return sendTrainingMsg('leave', 'notFound', [msg, []])
    }
    for (let a of arenas) {
        a.trainingQueue.pull(msg.authorId);
        a.markModified('trainingQueue');
        await a.save();
    }
    return sendTrainingMsg('leave', 'success', [msg, arenas])
}

async function manageTrainingMsg(args, msg) {
    if (!checkRoles(msg.author, 'coach')) {
        return sendTrainingMsg('manage', 'permissionFail', [msg]);
    }
    let arena = await Arena.findOne({ _id: msg.authorId, isTraining: true }).exec()
    if (!arena) {
        return sendTrainingMsg('manage', 'notFound', [msg]);
    }

    if (!args.length) {
        arena.trainingQueue.sort(dynamicSort('time'));
        for (let [i, user] of arena.trainingQueue.entries()) {
            user['tag'] = i + 1;
        }
        arena.markModified('trainingQueue')
        arena.save()
        return sendTrainingMsg('manage', 'check', [msg, arena])
    }
    if (args[0] == 'all') {
        return 'clear all, not finished'
    }
    let user = arena.trainingQueue.find((user) => { return user.tag == args[0] });
    // console.log(user);
    arena.trainingQueue.pull({ tag: args[0] })
    arena.markModified('trainingQueue');
    await arena.save();
    return sendTrainingMsg('manage', 'removed', [msg, arena, user])
}

async function sendTrainingMsg(command, type, vars) {
    try {
        const msg = vars[0];
    } catch (error) {
        console.error('msg error!', error);
    }
    const arenaMsg = await trainingMsgBuilder(command, type, vars);
    // console.log(arenaMsg);
    if (arenaMsg) {
        bot.sendChannelMessage(9, vars[0].channelId, arenaMsg, vars[0].msgId);
    }
}

async function trainingMsgBuilder(command, type, vars = []) {
    let msg, arena;
    try {
        msg = vars[0];
        // console.log('msg', msg)
        arena = vars[1]
    } catch (error) {
        console.error(error)
    }
    let msgCreator = {
        'create': async (type) => {
            let content = '';
            switch (type) {
                case 'fail':
                    return '权限不足，只有教练组可以发起特训房。'
                case 'help':
                    return '特训功能为教练组专属。创建房间请输入：\n`.房间 特训 房间号 密码 加速 人数限制 留言`\n如：`.房间 特训 76VR2 147 裸连 5人 今天用库巴`\n创建时会自动发送全体提醒，创建后可查看和移除排队人员：`.房间 管理`';
                case 'success':
                    content = `@所有人（未来会改） ${msg.author.nickname} 刚刚创建了特训房！\n请输入\`.房间 排队 @${msg.author.nickname}\`进行排队。\n取消排队或退出房间后请发送\`.房间 退出\`。\n> 多次不主动退出会被暂时禁止参加特训。`
                    setTimeout(() => {
                        bot.sendChannelMessage(9, msg.channelId, content)
                    }, 5 * 1e3);
                    return `特训房间创建成功！即将呼叫全体。\n` + await findArenaMsg()
                case 'wrong_args':
                    return '参数数量错误' + msgCreator['create']('help')
                default:
                    break;
            }
        },
        'join': (type) => {
            let content = '';
            switch (type) {
                case 'success':
                    content = ''.concat(
                        '成功加入排队：', `\`${arena.userNick}的特训房\`\n`,
                        '房间号/密码：', `[${arena.arenaId} ${arena.password}] `,
                        '当前排队人数：', `${arena.trainingQueue.length}/${arena.trainingLimit}`
                    )
                    return content
                case 'notFound':
                    return '没有找到可加入的房间。';
                case 'alreadyJoin':
                    return '你已经在排队中。如需换到队尾请先输入`.房间 退出`，退出后重新排队。';
                case 'help':
                default:
                    return '特训房排队请输入`.房间 特训 @房主`';
            }
        },
        'leave': (type) => {
            let content = '';
            switch (type) {
                case 'success':
                    
                    for (let a of arena) {
                        content += `\`${arena.userNick}的特训房\`\n`;
                    }
                    return '已离开房间：\n' + content
                case 'notFound':
                    return '没有找到可退出的房间。'
                default:
                    break;
            }
        },
        'manage': (type) => {
            let queue = '';
            let content;
            switch (type) {
                case 'permissionFail':
                    return '权限不足，只有教练组可以发起和管理特训房'
                case 'check':
                    
                    // console.log(arena)
                    for (const user of arena.trainingQueue) {
                        console.log(user)
                        queue += `${user.tag}\. ${user.userNick}(${formatTime(user.time)})\n`
                    }
                    content = ''.concat(
                        '```markdown\n',
                        `${msg.author.nickname}的特训房\n`,
                        '当前排队：\n',
                        queue,
                        '如需移除请发送[.房间 移除 序号]```'
                    )
                    return content
                case 'removed':
                    return ''.concat(
                        `(met)${vars[2].id}(met) 你已被移出\`${msg.author.nickname}的特训房\`队伍。\n> 多次不主动退出的话会暂时禁止参加特训。`
                    )
                case 'notFound':
                    return '没有找到可管理的特训房'
                default:
                    break;
            }
        },
        'help': (type) => {
            return '特训功能为教练组专属。创建时会自动发送全体提醒。\n`.房间 特训 房间号 密码 加速 人数限制 留言`\n如：`.房间 特训 76VR2 147 裸连 5人 今天用库巴`\n创建后可查看和移除排队人员：`.房间 管理`';
        }
    }
    return await msgCreator[command](type)
}




export default trainingCommand