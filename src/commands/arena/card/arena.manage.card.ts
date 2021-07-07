import { BaseSession, Card } from 'kbotify';
import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';
import { ArenaSession } from '../arena.types';

export function arenaManageCard(arena: ArenaDoc) {
    let memberString = '房间中还没有人。试着分享给其他人吧！';
    if (arena.member?.length) {
        let nickList = arena.member.map((member) => {
            return member.nickname;
        });
        memberString = nickList.join(', ') + ' 在房间中';
    }
    const expireCard = [];
    if (arena.expired)
        expireCard.push(
            new Card()
                .setTheme('warning')
                .addText(
                    '你的房间已关闭，不会显示在房间列表中。\n你可以点击延长有效期来刷新，或重新创建。'
                )
        );
    return [
        ...expireCard,
        new Card({
            type: 'card',
            theme: 'primary',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '房间管理菜单',
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
                    type: 'divider',
                },
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: `${arena.nickname} 的房间 (${
                            arena.join ? '允许加入中' : '已暂停加入'
                        })`,
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
                                content: `**房间信息**\n${arena.info ?? ''}`,
                            },
                            {
                                type: 'kmarkdown',
                                content: `**有效至**\n${formatTime(
                                    arena.expireAt
                                )}`,
                            },
                        ],
                    },
                },
                {
                    type: 'action-group',
                    elements: [
                        {
                            type: 'button',
                            theme: arena.join ? 'warning' : 'success',
                            value: `.房间 管理 join ${arena.join ? 0 : 1}`,
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: arena.join ? '暂停加入' : '允许加入',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'info',
                            value: '.房间 管理 更新',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '更新房间信息',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.房间 管理 延期',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '延长有效期',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'danger',
                            value: '.房间 管理 关闭',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '关闭房间',
                            },
                        },
                    ],
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
        }),
    ];
}
