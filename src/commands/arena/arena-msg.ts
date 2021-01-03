import { TextMessage } from 'kaiheila-bot-root/dist/types';
import { ArenaDoc } from '../../models/Arena';
import bot from '../../utils/bot_init';
import { formatTime } from '../../utils/utils';
import {
    arenaMsgCreator,
    ArenaData,
    ArenaCommandStatus,
    ArenaCommandList,
} from './arena-helper';
import { arenaFind } from './arena-exec';

async function sendArenaMsg(data: ArenaData): Promise<ArenaData> {
    const msg = data.msg;
    const mention = `(met)${msg.authorId}(met) `;
    const arenaMsg = (mention + data.content) as string;

    bot.sendChannelMessage(9, msg.channelId, arenaMsg, msg.msgId);

    return data;
}

/**
 * Build arena command mesages, decompose the data first and then switch by command, result.
 * Result can include things like 'SUCCESS', 'NO_ARENA', 'FAIL', 'ERROR'.
 *
 * @param data
 * @return {*}
 */
async function arenaMsgBuilder(data: ArenaData): Promise<string> {
    const [command, type, msg, arena, arenas] = [
        data.command as keyof arenaMsgCreator,
        data.result.status as string,
        data.msg as TextMessage,
        data.arena as ArenaDoc,
        data.arenas as ArenaDoc[],
    ];

    const creator: arenaMsgCreator = {
        create: async (type: string): Promise<string> => {
            switch (type) {
                case ArenaCommandStatus.success:
                    return (
                        '建房成功！\n关闭房间后记得发送`.关房`删除记录。\n---\n' +
                        (await arenaFind(data)).content
                    );
                    break;
                case 'FAIL':
                    return '创建失败，请检查房间号、密码格式，并确认房间信息文字不长于8。';
                    break;
                case 'help':
                default:
                    return '创建房间请发送：`.建房 房间号 密码 房间信息 (留言)`\n如：`.建房 BPTC1 147 港服3人 娱乐房，随便玩~`\n房间号、密码、房间信息必填，留言选填。';
            }
        },
        find: async (type: string) => {
            let trainingFlag = false;
            let content = '当前房间：\n';
            switch (type) {
                case 'FAIL':
                    data.command = ArenaCommandList.create;
                    data.result.status = ArenaCommandStatus.help;
                    return (
                        '当前没有房间。\n---\n' + (await arenaMsgBuilder(data))
                    );
                case 'SUCCESS':
                    for (const arena of arenas) {
                        const arenaMsgBlock = ''.concat(
                            `房主：${arena.userNick}\n`,
                            `房间：[${arena.arenaId} ${arena.password}] (${arena.arenaInfo})\n`,
                            `留言：${arena.remark} (创建于${formatTime(
                                arena.createdAt
                            )})`
                        );
                        if (arena.isTraining) {
                            trainingFlag = true;
                            const trainingMsgBlock = ''; //`\n排队中/房间大小：${arena.trainingQueue.length}/${arena.trainingLimit}人\n`;
                            content +=
                                '```plain\n**特训房**\n' +
                                arenaMsgBlock +
                                trainingMsgBlock +
                                '```\n';
                        } else if (!arena.isTraining && trainingFlag === true) {
                            content +=
                                '---\n> ' +
                                '```markdown\n' +
                                arenaMsgBlock +
                                '```\n';
                            trainingFlag = false;
                        } else {
                            content +=
                                '```markdown\n' + arenaMsgBlock + '```\n';
                        }
                    }
                    return content;
                default:
                    return '';
            }
        },
        delete: async (type: string) => {
            switch (type) {
                case 'SUCCESS':
                    return `(met)${msg.authorId}(met) 房间\`${arena.arenaId}\`已删除。`;
                default:
                    return `(met)${msg.authorId}(met) 未找到可删除的房间。`;
            }
        },
        alert: async (type: string) => {
            switch (type) {
                case 'SUCCESS':
                    // console.log(arena, 'arena');
                    // eslint-disable-next-line no-case-declarations
                    const msgBlock = ''.concat(
                        '```markdown\n',
                        `房间：[${arena.arenaId} ${arena.password}] (${arena.arenaInfo})\n`,
                        `留言：${arena.remark} (创建于${formatTime(
                            arena.createdAt
                        )})`,
                        '```'
                    );
                    return ''.concat(
                        '的房间广播\n',
                        msgBlock,
                        '\n(met)all(met)'
                    );
                // case 'no_account':
                //     return;
                // case 'time_limit':
                //     return;
                // case 'error':
                //     return '出bug了';
                case 'help':
                default:
                    return '请发送`.房间 广播 广播语`，房间将被广播给所有人。\n如：`.房间 广播 求个剑人，想练对策`';
            }
        },
        help: async () => {
            const content = ''.concat(
                '> **房间功能使用帮助**\n\r',
                '```\n【创建房间】将房间添加至房间列表（覆盖之前的）\n[.建房/.开房 房间号 密码 房间信息 留言]\n[.房间 创建 房间号 密码 房间信息 留言]```\n',
                '```\n【查看房间】查看房间列表中的房间\n[.找房]\n[.房间 查看]```\n',
                '```\n【关闭房间】删除房间列表中自己的房间\n[.关房]\n[.房间 关闭/删除]```\n',
                '```\n【广播找人】将自己创建的房间发送广播提醒\n[.房间 广播 广播语]```\n',
                '```\n【特训】：教练组专属，可自动发送提醒，其他人需排队加入房间。\n[.房间 特训 房间号 密码 加速 人数限制 留言]\n[.房间 管理], [.房间 排队 @房主]```'
            );
            return content;
        },
    };
    return creator[command](type);
}

export { sendArenaMsg, arenaMsgBuilder };
