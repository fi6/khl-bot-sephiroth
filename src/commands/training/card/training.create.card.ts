import { Card } from 'kbotify';
import { ArenaDoc } from '../../../models/Arena';
import { TrainingArenaDoc } from '../../../models/TrainingArena';
import { formatTime } from '../../../utils/format-time';

export function createTrainingHelpCard(oldArena: ArenaDoc | null) {
    const now = Date.now();
    let example =
        '例: `5F23C  147  裸连3人  今天不语音，打完给大家发小作文`\n房间留言很重要，不要写`随便打打`';
    if (oldArena) {
        example =
            '上次的房间信息：`' +
            [
                oldArena.code,
                oldArena.password,
                oldArena.info,
                oldArena.title,
            ].join(' ') +
            '`\n房间号为必填，其他为选填。系统会自动继承上次的房间信息。';
    }
    return new Card({
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
                        '请输入`房间号  密码  房间信息  房间留言`，用空格分开。',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: example,
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
                        content: '请在倒计时结束前完成输入。',
                    },
                ],
            },
        ],
    });
}

export function createTrainingSuccessCard(arena: TrainingArenaDoc) {
    return [
        new Card({
            type: 'card',
            theme: 'secondary',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '教学房间管理',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: '开黑啦是最好的~~语音~~软件:smile:',
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
                                content: `**房间信息**\n${arena.info}`,
                            },
                            {
                                type: 'kmarkdown',
                                content: `**排队状态**\n${
                                    arena.register ? '允许排队' : '停止排队'
                                }`,
                            },
                        ],
                    },
                },
                {
                    type: 'action-group',
                    elements: [
                        {
                            type: 'button',
                            theme: arena.register ? 'warning' : 'success',
                            value: `.教练房 管理 register ${
                                arena.register ? '0' : '1'
                            }`,
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: arena.register
                                    ? '禁止排队'
                                    : '允许排队',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'info',
                            value: '.教练房 管理 info',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '更新房间信息',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: 'ok',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '呼叫',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: 'ok',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '关闭房间',
                            },
                        },
                    ],
                },
                {
                    type: 'action-group',
                    elements: [
                        {
                            type: 'button',
                            theme: 'primary',
                            value: 'ok',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '呼叫下一名',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: 'ok',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '呼叫序号',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: 'ok',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '设置结束序号',
                            },
                        },
                    ],
                },
            ],
        }),
    ];
}
