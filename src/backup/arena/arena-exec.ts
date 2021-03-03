// import Arena, { ArenaDoc } from '../../models/Arena';
// import { arenaMsgBuilder } from './arena-msg';
// import arenaConfig from '../../configs/arena';
// import { checkRoles } from '../../utils/utils';
// import { ArenaResultStatus, ArenaSession, ArenaCommands } from './arena-helper';

// /**
//  * Create arena and add arenaFind as content.
//  *
//  * @param data
//  * @return {*}
//  */
// async function createArena(data: ArenaSession): Promise<ArenaSession> {
//     const arenaReg = /^\w{5}$/;
//     const passReg = /^\d{0,8}$/;
//     const args = data.args;
//     const msg = data.msg;

//     let remark = '';
//     if (args.length < 3) {
//         // no args found, return menu
//         data.result_status = ArenaResultStatus.help;
//         data.content = await arenaMsgBuilder(data);
//         return data;
//     }

//     if (
//         !arenaReg.test(args[0]) ||
//         !passReg.test(args[1]) ||
//         args[2].length > 7
//     ) {
//         data.content = await arenaMsgBuilder(data);
//         return data;
//     }

//     const [arenaId, password, arenaInfo] = [
//         args[0].toUpperCase(),
//         args[1],
//         args[2],
//     ];

//     if (args.length === 4) {
//         remark = args[3];
//     } else {
//         remark = '';
//     }

//     data.arena = await Arena.findByIdAndUpdate(
//         session.userId,
//         {
//             userNick: msg.author.nickname,
//             arenaId: arenaId,
//             password: password,
//             arenaInfo: arenaInfo,
//             remark: remark,
//             isTraining: false,
//             createdAt: new Date(),
//         },
//         {
//             upsert: true,
//         }
//     ).exec();
//     data.result_status = ArenaResultStatus.success;
//     data.content = await arenaMsgBuilder(data);
//     return data;
// }

// /**
//  * Get arenas from database and return a data which content is block of arenas.
//  *
//  * @param data Data in pipeline. In this case, only data.arenas is changed.
//  * @return {*}
//  */
// async function findArena(data: ArenaSession): Promise<ArenaSession> {
//     const arenaExpireTime = new Date(
//         new Date().valueOf() - arenaConfig.validTime
//     );
//     try {
//         data.arenas = await Arena.find({
//             createdAt: {
//                 $gte: arenaExpireTime,
//             },
//         })
//             .sort([
//                 ['isTraining', -1],
//                 ['createdAt', -1],
//             ])
//             .exec();
//         if (data.arenas.length == 0) {
//             data.result_status = ArenaResultStatus.no_arena;
//             data.content = await arenaMsgBuilder(data);
//         } else {
//             data.result_status = ArenaResultStatus.success;
//             data.content = await arenaMsgBuilder(data);
//         }
//         return data;
//     } catch (e) {
//         console.error('Error when trying to find arena', e);
//         data.result_status = 'ERROR';
//         data.result = { details: e };
//         return data;
//     }
//     // console.log(arenas)
// }

// /**
//  *
//  * @param data
//  */
// async function deleteArena(data: ArenaSession): Promise<ArenaSession> {
//     try {
//         data.arena = await Arena.findByIdAndDelete(data.session.userId).exec();
//         if (!data.arena) {
//             data.result_status = ArenaResultStatus.no_arena;
//             data.content = await arenaMsgBuilder(data);
//         } else {
//             data.result_status = ArenaResultStatus.success;
//             data.content = await arenaMsgBuilder(data);
//         }
//         return data;
//     } catch (e) {
//         console.error('Error when deleting arena', e, data);
//         // data.result_status = ArenaResultStatus.error;
//         // data.result.details = e;
//         return data;
//     }
// }

// /**
//  * Braodcast an arena to #Arena channel.
//  *
//  * @param data data in the pipeline
//  * @return {*}
//  */
// async function alertArena(data: ArenaSession): Promise<ArenaSession> {
//     let timeLimit;
//     if (checkRoles(data.msg.author.roles, 'up')) {
//         timeLimit = 10 * 6e4;
//     } else {
//         timeLimit = 30 * 6e4;
//     }
//     // check args
//     if (data.args.length != 1) {
//         data.result_status = ArenaResultStatus.help;
//         data.content = await arenaMsgBuilder(data);
//         return data;
//     }
//     // --------find profile--------
//     // let profile = Profile.findById(session.userId).exec();
//     // if (!profile.length) {
//     //     return sendMsg('alert', 'no_account', [msg])
//     // }
//     // // time limit
//     // if (Date.now() - profile.alertUsedAt < timeLimit) {
//     //     return sendMsg('alert', 'time_limit', [msg])
//     // }
//     // find arena for alert
//     const arena = await Arena.findById(data.session.userId).exec();
//     if (!arena) {
//         data.result_status = ArenaResultStatus.no_arena;
//         data.content = await arenaMsgBuilder(data);
//         return data;
//     }
//     // --------alert--------
//     // Profile.findByIdAndUpdate(session.userId, { alertUsedAt: Date.now() }, (err, res) => {
//     //     if (err) {
//     //         console.error(err);
//     //         return sendMsg('alert', 'error')
//     //     }
//     //     return sendMsg('alert', 'success', [msg, arena, args]);
//     // })
//     data.result_status = ArenaResultStatus.success;
//     data.content = await arenaMsgBuilder(data);
//     return data;
// }

// async function helpArena(data: ArenaSession): Promise<ArenaSession> {
//     data.commandCode = ArenaCommands.help;
//     data.content = await arenaMsgBuilder(data);
//     return data;
// }

// export { createArena, findArena, deleteArena, alertArena, helpArena };
