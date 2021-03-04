import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';
import { mentionUser } from '../../../utils/khl';

export function createStartCard() {
    return {
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '创建房间',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'plain-text',
                    content:
                        '如果你还不熟悉使用方法，可以点击右侧按钮，机器人将协助你创建。',
                },
                mode: 'right',
                accessory: {
                    type: 'button',
                    theme: 'success',
                    click: 'return-val',
                    value: '.房间 创建 hp',
                    text: {
                        type: 'plain-text',
                        content: '开始创建',
                    },
                },
            },
            {
                type: 'divider',
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '如果你熟悉机器人的使用方法，可以使用命令创建。\n创建房间的完整指令格式：\n`.建房 房间号 密码 加速/人数 (留言)`',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: '创建房间后，你可以广播给频道内所有人。',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: '',
                },
            },
        ],
    };
}

export function createHelpCard() {
    let now = Date.now();
    return {
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '创建房间',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '请输入房间号、密码、房间信息，用空格分开，房间必须为公开且有密码。',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: '\n例: `5F23C  147  帆游自动3人`',
                },
            },
            {
                type: 'countdown',
                mode: 'second',
                startTime: now,
                endTime: now + 120 * 1e3,
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain-text',
                        content:
                            '请在倒计时结束前完成输入，否则请重新开始创建。',
                    },
                ],
            },
        ],
    };
}

export function createSuccessCard(arena: ArenaDoc) {
    let memberString = '房间中还没有人。快去广播吧！';
    let card1 = {
        type: 'card',
        theme: 'success',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '房间创建成功',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        `${mentionUser(
                            arena._id
                        )}房间创建成功！你的房间信息如下。` +
                        '\n你可以点击`广播`以将房间广播给所有人。如需更新房间信息，重新创建即可。',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '房间有效期为60分钟。如需关闭房间，请发送`.关房`。如果无人加入，房间将于10分钟后自动关闭。',
                },
            },
        ],
    };
    let card2 = {
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: `${arena.userNick} 的房间`,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'paragraph',
                    cols: 3,
                    fields: [
                        {
                            type: 'kmarkdown',
                            content: `**房间号/密码**\n${arena.code} ${arena.password}`,
                        },
                        {
                            type: 'kmarkdown',
                            content: `**房间信息**\n${arena.arenaInfo ?? ''}`,
                        },
                        {
                            type: 'kmarkdown',
                            content: `**创建时间**\n${formatTime(
                                arena.createdAt
                            )}`,
                        },
                    ],
                },
                mode: 'right',
                accessory: {
                    type: 'button',
                    theme: 'primary',
                    value: `.房间 广播`,
                    click: 'return-val',
                    text: {
                        type: 'plain-text',
                        content: '广播',
                    },
                },
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain-text',
                        content: memberString,
                    },
                ],
            },
        ],
    };
    return [card1, card2];
}
