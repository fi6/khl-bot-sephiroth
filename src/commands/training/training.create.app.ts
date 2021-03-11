// import bot from 'init/bot_init';
// import { ArenaSession } from 'commands/arena/arena.types';
// import { arenaInfoMsg } from 'commands/arena/shared/arena.info.msg';
// import { TextMessage } from 'kaiheila-bot-root/dist/types';
// import { AppCommand, AppFunc } from 'kbotify';

// import { checkRoles } from './shared/training.checkroles';
// import { trainingUpsert } from './shared/training.upsert';
// import { argsCheckerToLimit } from './shared/training.check-create-args';

// class TrainingCreate extends AppCommand<ArenaSession> {
//     code = 'create';
//     trigger = '特训';
//     help =
//         '特训功能为教练组专属。创建房间命令格式：\n`.房间 特训 房间号 密码 加速 人数限制 留言`\n创建时会自动发送全体提醒，创建后可发送`.房间 管理`查看队伍和移除玩家。\n如：`.房间 特训 76VR2 147 裸连 5人 今天用库巴`';
//     func: AppFunc<ArenaSession> = async (data: ArenaSession) => {
//         // console.log('receive create training', data)
//         const [msg, args] = [data.msg as TextMessage, data.args as string[]];

//         // error handling
//         if (!checkRoles(msg.author.roles, 'coach')) {
//             return session.replyTemp(
//                 '权限不足，只有教练组可以发起特训房。',
//                 data
//             );
//         }
//         if (!args.length) {
//             return session.sendTemp(this.help, data);
//         } else if (args.length !== 5) {
//             // no args found, return menu
//             return session.replyTemp('参数数量错误' + this.help, data);
//         }

//         const limit = argsCheckerToLimit(args);
//         if (typeof limit === 'undefined')
//             return session.replyTemp(
//                 '参数格式错误。请检查房间号、密码，并确认加速、人数文字长度小于8',
//                 data
//             );

//         // start creating
//         data.arena = await trainingUpsert(data, limit);

//         if (!data.arena)
//             throw new Error(
//                 'Upsert should return an arena when creating training arena.'
//             );

//         const content = ''.concat(
//             `@所有人（未来会改） ${msg.author.nickname} 刚刚创建了特训房！\n请输入\`.房间 排队 @${msg.author.nickname}\`进行排队。\n`,
//             '---\n',
//             arenaInfoMsg(data.arena),
//             '> 取消排队或退出房间后请发送`.房间 退出`。\n多次不主动退出会被暂时禁止参加特训。'
//         );
//         setTimeout(() => {
//             bot.API.message.create(9, msg.channelId, content);
//         }, 3e3);

//         return session.replyTemp(`特训房间创建成功！即将呼叫全体。`, data);
//     };
// }

// export const trainingCreate = new TrainingCreate();
