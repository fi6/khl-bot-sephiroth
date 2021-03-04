// import { TextMessage } from 'kaiheila-bot-root/dist/types';
// import Arena, { ArenaDoc } from 'models/Arena';
// import { checkRoles } from 'utils/utils';
// import { TrainingCommands, TrainingResultStatus } from './training-helper';
// import { trainingMsgBuilder } from './training-msg';

// /**
//  * Create Training Arena, which set isTraining to true and initialize trainingQueue.
//  *
//  * @param data Arena data, same as arena commands.
//  * @return {*}
//  */
// // export async function createTraining(data: ArenaSession): Promise<ArenaSession> {
// //     // console.log('receive create training', data)
// //     const [msg, args] = [data.msg as TextMessage, data.args as string[]];

// //     const arenaReg = /^\w{5}$/;
// //     const passReg = /^\d{0,8}$/;

// //     // error handling
// //     if (!checkRoles(msg.author.roles, 'coach')) {
// //         data.result_status = TrainingResultStatus.fail;
// //         data.content = await trainingMsgBuilder(data);
// //         return data;
// //     }
// //     if (!args.length) {
// //         data.result_status = TrainingResultStatus.help;
// //         return data.generateContent();
// //     } else if (args.length !== 5) {
// //         // no args found, return menu
// //         data.result_status = TrainingResultStatus.wrong_args_num;
// //         return data.generateContent();
// //     }
// //     const limit = /\d/.exec(args[3]) as RegExpExecArray;
// //     if (
// //         !arenaReg.test(args[0]) ||
// //         !passReg.test(args[1]) ||
// //         !limit ||
// //         args[2].length > 7
// //     ) {
// //         data.result_status = TrainingResultStatus.wrong_args;
// //         return data.generateContent();
// //     }

//     // start creating

// //     data.arena = await Arena.findByIdAndUpdate(
// //         session.userId,
// //         {
// //             nickname: msg.author.nickname,
// //             arenaId: args[0].toUpperCase(),
// //             password: args[1],
// //             arenaInfo: args[2],
// //             isTraining: true,
// //             trainingLimit: parseInt(limit[0]),
// //             trainingQueue: [],
// //             remark: args[4],
// //             createdAt: new Date(),
// //         },
// //         {
// //             upsert: true,
// //             new: true,
// //             setDefaultsOnInsert: true,
// //         }
// //     );
// //     data.result_status = TrainingResultStatus.success;
// //     return data.generateContent();
// // }

// export async function joinTraining(data: ArenaSession): Promise<ArenaSession> {
//     const [msg, args] = [data.msg as TextMessage, data.args as string[]];

//     if (msg.mention.user.length != 1) {
//         data.result_status = TrainingResultStatus.help;
//         return data.generateContent();
//     }
//     data.arena = await Arena.findOne({
//         _id: msg.mention.user[0],
//         isTraining: true,
//     }).exec();
//     if (!data.arena) {
//         data.result_status = TrainingResultStatus.no_arena;
//         return data.generateContent();
//     }
//     for (const user of data.arena.trainingQueue) {
//         if (user._id == session.userId) {
//             data.result_status = TrainingResultStatus.in_queue;
//             return data.generateContent();
//         }
//     }
//     console.log('queue:', data.arena.trainingQueue);
//     const last_tag = data.arena.trainingQueue.length
//         ? data.arena.trainingQueue[data.arena.trainingQueue.length - 1].tag + 1
//         : 1;
//     // let last_tag;
//     // if (!data.arena.trainingQueue[-1].tag) {
//     //     last_tag = 1;
//     // } else {
//     //     last_tag = data.arena.trainingQueue[-1].tag + 1;
//     // }
//     data.arena.trainingQueue.push({
//         _id: session.userId,
//         nickname: msg.author.nickname,
//         time: new Date(),
//         tag: last_tag,
//     });
//     data.arena.isNew = false;
//     data.arena.markModified('trainingQueue');
//     await data.arena.save();

//     data.result_status = TrainingResultStatus.success;
//     return data.generateContent();
// }

// export async function leaveTraining(data: ArenaSession): Promise<ArenaSession> {
//     const msg = data.msg;
//     if (!msg.mention.user.length) {
//         data.arenas = await Arena.find({
//             'trainingQueue._id': session.userId,
//         }).exec();
//         // console.log(arenas);
//     } else {
//         data.arenas = [
//             await Arena.findById(msg.mention.user[0]).exec(),
//         ] as typeof data.arenas;
//     }
//     if (!data.arenas) {
//         data.result_status = TrainingResultStatus.no_arena;
//         return data.generateContent();
//     }
//     try {
//         data.arenas.forEach(async (a) => {
//             await Arena.updateOne(
//                 { _id: a?._id },
//                 { $pull: { trainingQueue: { _id: session.userId } } }
//             );
//         });
//     } catch (error) {
//         console.error(error);
//         data.result_status = TrainingResultStatus.error;
//         return data.generateContent();
//     }
//     data.result_status = TrainingResultStatus.success;
//     return data.generateContent();
// }

// export async function manageTraining(data: ArenaSession): Promise<ArenaSession> {
//     const [msg, args] = [data.msg, data.args];

//     // check if coach
//     if (!checkRoles(msg.author.roles, 'coach')) {
//         data.result_status = TrainingResultStatus.fail;
//         return data.generateContent();
//     }

//     // find arena
//     data.arena = await Arena.findOne({
//         _id: session.userId,
//         isTraining: true,
//     }).exec();

//     // no arena found
//     if (!data.arena) {
//         data.result_status = TrainingResultStatus.no_arena;
//         return data.generateContent();
//     }

//     // if (!args.length) {
//     //     data.arena.trainingQueue.sort(dynamicSort('time'));
//     //     for (const [i, user] of data.arena.trainingQueue.entries()) {
//     //         user['tag'] = i + 1;
//     //     }
//     //     data.arena.markModified('trainingQueue');
//     //     data.arena.save();

//     // }

//     data.result_status = TrainingResultStatus.success;
//     return data.generateContent();
// }

// /**
//  * Kick user in the queue by tag generated in manageTraining.
//  *
//  * @export
//  * @param data
//  * @return {*}
//  */
// export async function kickTraining(data: ArenaSession): Promise<ArenaSession> {
//     const [msg, args] = [data.msg, data.args];
//     if (!checkRoles(msg.author.roles, 'coach')) {
//         data.result_status = TrainingResultStatus.fail;
//         return data.generateContent();
//     }
//     const arena = await Arena.findOne({
//         _id: session.userId,
//         isTraining: true,
//     }).exec();
//     if (!arena) {
//         data.result_status = TrainingResultStatus.no_arena;
//         return data.generateContent();
//     }
//     if (!args[0]) {
//         data.result_status = TrainingResultStatus.help;
//         return data.generateContent();
//     } else if (args[0] == 'all') {
//         data.content = '尚未完工';
//         //     return 'clear all, not finished';
//     }
//     try {
//         data.other = [] as string[];
//         for (const tag of args[0].split(/[,，]/)) {
//             const user = arena.trainingQueue.find((u) => {
//                 return u.tag?.toString() === tag;
//             });
//             if (!user) {
//                 throw new Error('user not found');
//             }
//             data.result.details = await Arena.updateOne(
//                 { _id: arena._id },
//                 { $pull: { trainingQueue: { tag: tag } } }
//             );
//             data.other.push(user._id);
//         }

//         // arena.markModified('trainingQueue');
//         // await arena.save();
//     } catch (error) {
//         console.error(error, data);
//         data.result_status = TrainingResultStatus.error;
//         return data.generateContent();
//     }
//     data.arena = arena;
//     data.result_status = TrainingResultStatus.success;
//     return data.generateContent();
// }

// export async function helpTraining(data: ArenaSession): Promise<ArenaSession> {
//     data.commandCode = TrainingCommands.help;
//     return data;
// }

// export {};
