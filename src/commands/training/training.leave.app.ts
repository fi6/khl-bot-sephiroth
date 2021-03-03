// import { ArenaSession } from 'commands/arena/arena.types';
// import { AppCommand, AppCommandFunc } from 'kbotify';
// import Arena from 'models/Arena';

// class TrainingLeave extends AppCommand<ArenaSession> {
//     trigger = '退出';
//     func: AppCommandFunc<ArenaSession> = async (data: ArenaSession) => {
//         const msg = data.msg;
//         if (!msg.mention.user.length) {
//             data.arenas = await Arena.find({
//                 'trainingQueue._id': session.userId,
//             }).exec();
//             // console.log(arenas);
//         } else {
//             data.arenas = [
//                 await Arena.findById(msg.mention.user[0]).exec(),
//             ] as typeof data.arenas;
//         }
//         if (!data.arenas) {
//             return session.replyTemp('没有找到可退出的房间。', data);
//         }
//         try {
//             data.arenas.forEach(async (a) => {
//                 await Arena.updateOne(
//                     { _id: a?._id },
//                     { $pull: { trainingQueue: { _id: session.userId } } }
//                 );
//             });
//         } catch (error) {
//             console.error(error);
//             return session.sendTemp('出现未知错误', data);
//         }
//         let content = '已离开：\n';
//         for (const a of data.arenas) {
//             content += `\`${a.userNick}的特训房\`\n`;
//         }
//         return session.replyTemp(content, data);
//     };
// }

// export const trainingLeave = new TrainingLeave();
