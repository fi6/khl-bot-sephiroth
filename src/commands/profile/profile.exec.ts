// import Profile, { IProfile } from '../../models/Profile';
// import bot from '../../utils/bot_init';
// import { fighterParse } from '../../utils/utils';
// import { createPipe, Pipe } from '../pipeline-helper';

// const profilePipe: Pipe<ProfileData> = createPipe();

// async function profileCommand(command: string, args, msg) {
//     const data: ProfileData = {
//         command: command,
//         args: args,
//         msg: msg,
//     };
//     // console.log(command, args, msg);
//     if (args.length == 4) {
//         //.档案 创建 奈斯，露琪娜 日港裸 北京，天津 娱乐向玩家
//         return pipeline(data, createProfile, sendMsg);
//     }

//     let subCommand = args.shift();
//     data.command = subCommand;
//     data.args = args;
//     switch (subCommand) {
//         case '创建': // <== .档案 创建
//             return pipeline(data, createProfile, sendMsg);
//         case '查看':
//             return pipeline(data, checkProfile, sendMsg);
//         case '修改':
//             return pipeline(data, modifyProfile, sendMsg);
//         default:
//             return sendMsg('help', null, msg);
//     }
// }

// async function checkProfile() {}

// async function modifyProfile() {}

// async function createProfile(data: IProfile): Promise<IProfile> {
//     //.档案 创建 [奈斯，露琪娜 日港裸 北京，天津 娱乐向玩家]

//     if (data.args.length !== 4) {
//         data.command = 'help';
//         return profileMsgBuilder(data);
//     }

//     const smashMain = data.args[0].split(/[, ，]/);
//     const networkRegex = [/日/, /港/, /裸/];
//     let network = [];
//     networkRegex.forEach((regex) => {
//         if (regex.test(data.args[1])) {
//             network.push(networkRegex.toString().substr(1, 1));
//         }
//     });

//     let regions = data.args[2].split(/[, ，]/);
//     for (let [i, r] of regions.entries()) {
//         regions[i] = fighterParse(r);
//     }
//     const bio = data.args[3];
//     Profile.findByIdAndUpdate(data.authorId, {});
// }

// async function sendMsg(data: IProfile) {
//     if (!Array.isArray(vars)) {
//         vars = [vars];
//     }
//     let msg;
//     try {
//         msg = vars[0];
//     } catch (error) {
//         console.error('msg error!', error);
//         return;
//     }
//     const arenaMsg = await profileMsgBuilder(command, type, vars);
//     // console.log(arenaMsg);
//     if (arenaMsg) {
//         bot.API.message.create(9, msg.channelId, arenaMsg, msg.msgId);
//     }
// }

// async function profileMsgBuilder(data: IProfile): Promise<IProfile> {
//     let msg, arena;
//     try {
//         msg = vars[0];
//         arena = vars[1];
//     } catch (error) {
//         console.error(error);
//     }
//     let msgCreator = {
//         create: async (type) => {
//             switch (type) {
//                 case 'success':
//                     return (
//                         `(met)${session.userId}(met) 建房成功！\n关闭房间后记得发送\`.关房\`删除记录。\n---\n` +
//                         (await findArenaMsg())
//                     );
//                 case 'fail':
//                     return '创建失败，请检查房间号、密码格式，并确认房间信息文字长度小于8。';
//                 case 'help':
//                     return '创建房间请发送：`.建房 房间号 密码 房间信息 (留言)`\n如：`.建房 BPTC1 147 港服3人 萌新马里奥想找个剑人练习~`\n房间号、密码、房间信息必填，留言选填。';
//                 default:
//                     break;
//             }
//         },
//         help: () => {
//             let content = ''.concat(
//                 '> **房间功能使用帮助**\n\r',
//                 '```\n【创建房间】将房间添加至房间列表（覆盖之前的）\n[.建房/.开房 房间号 密码 房间信息 留言]\n[.房间 创建 房间号 密码 房间信息 留言]```\n',
//                 '```\n【查看房间】查看房间列表中的房间\n[.找房]\n[.房间 查看]```\n',
//                 '```\n【关闭房间】删除房间列表中自己的房间\n[.关房]\n[.房间 关闭/删除]```\n',
//                 '```\n【广播找人】将自己创建的房间发送广播提醒\n[.房间 广播]```\n',
//                 '```\n【特训】：教练组专属，可自动发送提醒，其他人需排队加入房间。\n[.房间 特训 房间号 密码 加速 人数限制 留言]\n[.房间 排队 @房主]```'
//             );
//             return content;
//         },
//     };
//     return msgCreator[command](type);
// }

// export default profileCommand;
