import { Card } from 'kbotify/dist/core/card';
import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';

export function arenaTitleCard(
    activeArena = 0,
    activePlayers: ArenaDoc['member'] = []
): Card {
    let nicknames: string = activePlayers.length
        ? activePlayers
              .slice(0, 5)
              .map((player) => {
                  return player.nickname;
              })
              .join(', ')
        : '暂无';
    if (activePlayers.length > 5) nicknames = nicknames + `等`;
    const card = new Card({
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '房间菜单',
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
                            content: `**活跃房间**\n${activeArena}`,
                        },
                        {
                            type: 'kmarkdown',
                            content: `**更新时间**\n${formatTime(new Date())}`,
                        },
                    ],
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: `玩家：${nicknames}`,
                },
            },
            {
                type: 'action-group',
                elements: [
                    {
                        type: 'button',
                        theme: 'success',
                        value: '.房间 创建',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '创建房间',
                        },
                    },
                    {
                        type: 'button',
                        theme: 'info',
                        value: '.房间 查看',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '查看房间列表',
                        },
                    },
                    {
                        type: 'button',
                        theme: 'primary',
                        value: '.房间 管理',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '管理房间',
                        },
                    },
                    {
                        type: 'button',
                        theme: 'secondary',
                        value: 'https://www.bilibili.com/read/cv11967248',
                        click: 'link',
                        text: {
                            type: 'plain-text',
                            content: '如何使用？',
                        },
                    },
                ],
            },
        ],
    });
    return card;
}

export function arenaMainCard(): Card {
    const card = new Card({
        type: 'card',
        theme: 'secondary',
        size: 'lg',
        modules: [
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain-text',
                        content: '点击按钮查看房间列表',
                    },
                ],
            },
        ],
    });
    return card;
}
