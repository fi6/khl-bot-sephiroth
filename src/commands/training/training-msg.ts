import { ArenaData, arenaMsgBlock } from 'commands/arena/arena-helper';
import { TextMessage } from 'kaiheila-bot-root/dist/types';
import { ArenaDoc } from 'models/Arena';
import bot from 'utils/bot_init';
import { formatTime } from 'utils/utils';
import {
    TrainingCommands,
    trainingMsgCreator,
    TrainingResultStatus,
} from './training-helper';

export async function sendTrainingMsg(data: ArenaData): Promise<ArenaData> {
    const msg = data.msg;
    const mention = `(met)${msg.authorId}(met) `;
    const arenaMsg = (mention + data.content) as string;

    bot.sendChannelMessage(9, msg.channelId, arenaMsg, msg.msgId);

    return data;
}

export async function trainingMsgBuilder(data: ArenaData): Promise<string> {
    const [command, type, msg, arena, arenas] = [
        data.commandCode as keyof trainingMsgCreator,
        data.result_status as string,
        data.msg as TextMessage,
        data.arena as ArenaDoc,
        data.arenas as ArenaDoc[],
    ];

    const msgCreator: trainingMsgCreator = {
        create: async (type: string): Promise<string> => {
            let content = '';
            switch (type) {
                case TrainingResultStatus.fail:
                    return '权限不足，只有教练组可以发起特训房。';

                case TrainingResultStatus.success:
                    content = ''.concat(
                        `@所有人（未来会改） ${msg.author.nickname} 刚刚创建了特训房！\n请输入\`.房间 排队 @${msg.author.nickname}\`进行排队。\n`,
                        '---\n```plain\n**特训房**\n',
                        arenaMsgBlock(arena),
                        '```',
                        '\n> 取消排队或退出房间后请发送`.房间 退出`。\n多次不主动退出会被暂时禁止参加特训。'
                    );
                    setTimeout(() => {
                        bot.sendChannelMessage(9, msg.channelId, content);
                    }, 3e3);
                    return `特训房间创建成功！即将呼叫全体。\n`;

                case TrainingResultStatus.wrong_args_num:
                    return '参数数量错误' + msgCreator['create']('help');

                case TrainingResultStatus.help:
                default:
                    return '特训功能为教练组专属。创建房间请输入：\n`.房间 特训 房间号 密码 加速 人数限制 留言`\n如：`.房间 特训 76VR2 147 裸连 5人 今天用库巴`\n创建时会自动发送全体提醒，创建后可查看和移除排队人员：`.房间 管理`';
            }
        },
        join: async (type: string): Promise<string> => {
            let content = '';
            switch (type) {
                case TrainingResultStatus.success:
                    content = ''.concat(
                        '成功加入排队：',
                        `\`${arena.userNick}的特训房\`\n`,
                        '房间号/密码：',
                        `[${arena.arenaId} ${arena.password}] `,
                        '当前排队人数：',
                        `${arena.trainingQueue.length}/${arena.trainingLimit}`
                    );
                    return content;
                case TrainingResultStatus.no_arena:
                    return '没有找到可加入的房间。';
                case TrainingResultStatus.in_queue:
                    return '你已经在排队中。如需换到队尾请先输入`.房间 退出`，退出后重新排队。';
                case TrainingResultStatus.help:
                default:
                    return '特训房排队请输入`.房间 特训 @房主`';
            }
        },
        leave: async (type: string): Promise<string> => {
            let content = '';
            switch (type) {
                case TrainingResultStatus.success:
                    for (const a of arenas) {
                        content += `\`${a.userNick}的特训房\`\n`;
                    }
                    return '已离开房间：\n' + content;
                case TrainingResultStatus.no_arena:
                    return '没有找到可退出的房间。';
                case TrainingResultStatus.help:
                default:
                    return '发送`.房间 退出`可退出所有排队中的特训房，发送`.房间 退出 @房主`可退出特定的特训房。';
            }
        },
        manage: async (type: string): Promise<string> => {
            let queue = '';
            let content = '';
            switch (type) {
                    case TrainingResultStatus.fail:
                        return '权限不足，只有教练组可以发起和管理特训房';
                    case TrainingResultStatus.success:
                        // console.log(arena)
                        for (const user of arena.trainingQueue) {
                            console.log(user);
                            queue += `${user.tag}. ${user.userNick}(${formatTime(
                                user.time
                            )})\n`;
                        }
                        content = ''.concat(
                            '```markdown\n',
                            `${msg.author.nickname}的特训房\n`,
                            '当前排队：\n',
                            queue,
                            '如需移除请发送[.房间 移除 序号]```'
                        );
                        return content;
                //     case 'removed':
                //         content = `(met)${vars[2].id}(met) 你已被移出\`${msg.author.nickname}的特训房\`队伍。\n> 多次不主动退出的话会暂时禁止参加特训。`
                //         setTimeout(() => {
                //             bot.sendChannelMessage(9, msg.channelId, content);
                //         }, 5 * 1e3);
                //         return ''.concat(

                //         );
                //     case 'notFound':
                //         return '没有找到可管理的特训房';
                default:
                    return '发送`.房间 管理`获取特训房内的排队列表及每个人的编号。\n如需将人移出队伍请输入`.房间 移出 对应编号`';
                    break;
            }
        },
        kick: async (type: string): Promise<string> => {
            return '特训功能为教练组专属。创建时会自动发送全体提醒。\n`.房间 特训 房间号 密码 加速 人数限制 留言`\n如：`.房间 特训 76VR2 147 裸连 5人 今天用库巴`\n创建后可查看和移除排队人员：`.房间 管理`';
        },
        help: async (type: string): Promise<string> => {
            return '特训功能为教练组专属。创建时会自动发送全体提醒。\n`.房间 特训 房间号 密码 加速 人数限制 留言`\n如：`.房间 特训 76VR2 147 裸连 5人 今天用库巴`\n创建后可查看和移除排队人员：`.房间 管理`';
        },
    };
    return await msgCreator[command](type);
}

export {};
