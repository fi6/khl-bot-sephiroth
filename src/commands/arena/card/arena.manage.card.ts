import { formatTime } from '../../../utils/format-time';
import { ArenaSession } from '../arena.types';

export function arenaManageCard(session: ArenaSession) {
    let arena = session.arena!;
    let memberString = '房间中还没有人。快去广播吧！';
    if (arena.member?.length) {
        let nickList = arena.member.map((member) => {
            return member.userNick;
        });
        memberString = nickList.join(', ') + ' 在房间中';
    }
    return [
        {
            type: 'card',
            theme: 'secondary',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '房间管理',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: '你也可以直接发送`.关房`关闭房间',
                    },
                },
                {
                    type: 'action-group',
                    elements: [
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.房间 管理 关闭',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '关闭房间',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.房间 广播',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '广播',
                            },
                        },
                    ],
                },
                {
                    type: 'divider',
                },
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
                                content: `**房间号/密码**\n${arena.arenaId} ${arena.password}`,
                            },
                            {
                                type: 'kmarkdown',
                                content: `**房间信息**\n${
                                    arena.arenaInfo ?? ''
                                }`,
                            },
                            {
                                type: 'kmarkdown',
                                content: `**创建时间**\n${formatTime(
                                    arena.createdAt
                                )}`,
                            },
                        ],
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: `留言：${
                            arena.remark == '' ? '未填写' : arena.remark
                        }`,
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
        },
    ];
}
