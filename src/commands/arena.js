import Arena from '../models/Arena.js';
import Profile from '../models/Profile.js'
import bot from '../utils/bot_init.js';
import { checkRoles } from '../utils/utils.js';
import trainingCommand from './training.js';

const arenaExpireTime = 60 * 6e4;


async function arenaCommand(command, args, msg) {
    // console.log(command, args, msg);
    let content;
    async function exec(command) {
        switch (command) {
            case '开房': // <== .开房
            case '建房':
                return createArena(args, msg);
            case '找房':
                return findArena(args, msg);
            case '关房':
                return deleteArena(args, msg);
            case '房间':
                return mainArenaMsg(args, msg);
            default:
                return sendMsg('help', null, [msg]);
        }
    }
    content = await exec(command);
    // console.log('content', content);
    // if (content) {
    //     bot.sendChannelMessage(9, msg.channelId, content, msg.msgId);
    // }
}


async function mainArenaMsg(args, msg) {
    let subCommand = args.shift();
    let content = '';
    content = await dist(subCommand, msg);
    // if (content) {
    //     bot.sendChannelMessage(9, msg.channelId, content, msg.msgId);
    // }

    async function dist(subCommand, msg) {
        switch (subCommand) {
            case '创建':
                return createArena(args, msg);
            case '查看':
                return findArena(args, msg);
            case '关闭':
                return deleteArena(args, msg);
            case '广播':
                return alertArena(args, msg);
            //以下为特训相关，需做跳转
            case '管理':
            case '排队':
            case '特训':
            case '移除':
            case '退出':
                trainingCommand(subCommand, args, msg);
                break;
            default:
                return sendMsg('help', null, [msg]);
        }
    }
}


async function createArena(args, msg) {
    const arenaReg = /^\w{5}$/;
    const passReg = /^\d{0,8}$/;
    let arenaId, password, arenaInfo;
    let remark = '';
    if (args.length < 3) { // no args found, return menu
        return sendMsg('create', 'help', [msg])
    }

    if (!arenaReg.test(args[0]) || !passReg.test(args[1]) || args[2].length > 7) {
        return sendMsg('create', 'fail', [msg]);
    }

    arenaId = args[0].toUpperCase();
    password = args[1];
    arenaInfo = args[2];
    if (args.length === 4) {
        remark = args[3];
    } else {
        remark = '';
    }

    await Arena.findByIdAndUpdate(msg.authorId, {
        userNick: msg.author.nickname,
        arenaId: arenaId,
        password: password,
        arenaInfo: arenaInfo,
        remark: remark,
        isTraining: false,
        createdAt: Date.now()
    }, {
        upsert: true
    })

    return sendMsg('create', 'success', [msg]);
}

async function findArenaMsg() {
    let content = '当前房间：\n';
    let arenas = await Arena.find({ createdAt: { $gte: Date.now() - arenaExpireTime } }).sort([['isTraining', -1], ['createdAt', -1]]).exec()

    // console.log(arenas)
    if (arenas.length == 0) {
        return false
    }
    let trainingFlag = false;
    for (let arena of arenas) {
        const arenaMsgBlock = ''.concat(`房主：${arena.userNick}\n`,
            `房间：[${arena.arenaId} ${arena.password}] (${arena.arenaInfo})\n`,
            `留言：${arena.remark} (创建于${format_time(arena.createdAt)})`);
        if (arena.isTraining) {
            trainingFlag = true;
            const trainingMsgBlock = `\n排队中/房间大小：${arena.trainingQueue.length}/${arena.trainingLimit}人\n`;
            content += ('```plain\n**特训房**\n' + arenaMsgBlock + trainingMsgBlock + '```\n');
        } else if (!arena.isTraining && trainingFlag == true) {
            content += ('---\n> ' + '```markdown\n' + arenaMsgBlock + '```\n')
            trainingFlag = false;
        } else {
            content += ('```markdown\n' + arenaMsgBlock + '```\n');
        }
    }
    return content
}


async function findArena(args, msg) {
    const content = await findArenaMsg(args, msg);
    // console.log('content', content)
    if (!content) { return sendMsg('find', 'fail', [msg]) }
    // console.log('run to here! find arena')
    return sendMsg('find', 'success', [msg, null, content])
}


async function deleteArena(args, msg) {
    Arena.findByIdAndDelete(msg.authorId).exec((err, arena) => {
        if (err) {
            console.error(err);
        }
        // console.log('arena', arena);
        if (!arena) {
            return sendMsg('delete', 'fail', [msg])
        }
        return sendMsg('delete', 'success', [msg, arena])
    })

}


async function alertArena(args, msg) {
    let timeLimit;
    if (checkRoles(msg.author, 'up')) {
        timeLimit = 30 * 6e4;
    } else {
        timeLimit = 12 * 60 * 6e4;
    }
    // check args
    if (args.length != 1) {
        return sendMsg('alert', 'help', [msg]);
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
    const arena = await Arena.findById(msg.authorId).exec();
    if (!arena) {
        return sendMsg('alert', 'no_arena', [msg])
    }
    // --------alert--------
    // Profile.findByIdAndUpdate(msg.authorId, { alertUsedAt: Date.now() }, (err, res) => {
    //     if (err) {
    //         console.error(err);
    //         return sendMsg('alert', 'error')
    //     }
    //     return sendMsg('alert', 'success', [msg, arena, args]);
    // })
    return sendMsg('alert', 'success', [msg, arena, args[0]]);
}


function format_time(s) {
    const dtFormat = new Intl.DateTimeFormat('en-GB', {
        timeStyle: 'short',
        timeZone: "Asia/Shanghai"
    });

    return dtFormat.format(new Date(s));
}

async function sendMsg(command, type, vars = []) {
    try {
        const msg = vars[0];
    } catch (error) {
        console.error('msg error!', error);
    }
    const arenaMsg = await arenaMsgBuilder(command, type, vars);
    // console.log(arenaMsg);
    if (arenaMsg) {
        if (vars[0].channelId === undefined) {
            console.error('PLEASE CHECK VARS INPUT');
        }
        bot.sendChannelMessage(9, vars[0].channelId, arenaMsg, vars[0].msgId);
    }
}


async function arenaMsgBuilder(command, type, vars = []) {
    let msg, arena;
    try {
        msg = vars[0];
        arena = vars[1];
    } catch (error) {
        console.error(error)
    }
    let msgCreator = {
        'create': async (type) => {
            switch (type) {
                case 'success':
                    return `(met)${msg.authorId}(met) 建房成功！\n关闭房间后记得发送\`.关房\`删除记录。\n---\n` + await findArenaMsg()
                case 'fail':
                    return '创建失败，请检查房间号、密码格式，并确认房间信息文字长度小于8。'
                case 'help':
                    return '创建房间请发送：`.建房 房间号 密码 房间信息 (留言)`\n如：`.建房 BPTC1 147 港服3人 娱乐房，随便玩~`\n房间号、密码、房间信息必填，留言选填。';
                default:
                    break;
            }
        },
        'find': async (type) => {
            switch (type) {
                case 'fail':
                    return '当前没有房间。\n---\n' + await arenaMsgBuilder('create', 'help')
                case 'success':
                    return vars[2];
                default:
                    break;
            }
        },
        'delete': (type) => {
            switch (type) {
                case 'success':
                    return `(met)${msg.authorId}(met) 房间\`${arena.arenaId}\`已删除。`;
                default:
                    return `(met)${msg.authorId}(met) 未找到可删除的房间。`;
            }
        },
        'alert': (type) => {
            switch (type) {
                case 'success':
                    // console.log(arena, 'arena');
                    const msgBlock = ''.concat('```markdown\n',
                        `房间：[${arena.arenaId} ${arena.password}] (${arena.arenaInfo})\n`,
                        `留言：${arena.remark} (创建于${format_time(arena.createdAt)})`, '```');
                    return ''.concat(
                        '(met)all(met) ' + `${vars[2]} ` + `(${msg.author.nickname}的房间广播)\n`,
                        msgBlock
                    )
                case 'no_account':
                    return
                case 'time_limit':
                    return
                case 'error':
                    return '出bug了'
                case 'help':
                default:
                    return '请发送`.房间 广播 广播语`，房间将被广播给所有人。\n如：`.房间 广播 求个剑人，想练对策`'
                    break;
            }

        },
        'help': () => {
            let content = ''.concat('> **房间功能使用帮助**\n\r',
                '```\n【创建房间】将房间添加至房间列表（覆盖之前的）\n[.建房/.开房 房间号 密码 房间信息 留言]\n[.房间 创建 房间号 密码 房间信息 留言]```\n',
                '```\n【查看房间】查看房间列表中的房间\n[.找房]\n[.房间 查看]```\n',
                '```\n【关闭房间】删除房间列表中自己的房间\n[.关房]\n[.房间 关闭/删除]```\n',
                '```\n【广播找人】将自己创建的房间发送广播提醒\n[.房间 广播 广播语]```\n',
                '```\n【特训】：教练组专属，可自动发送提醒，其他人需排队加入房间。\n[.房间 特训 房间号 密码 加速 人数限制 留言]\n[.房间 管理], [.房间 排队 @房主]```'
            );
            return content
        },
    }
    return msgCreator[command](type)
}

export default arenaCommand
export { findArenaMsg }