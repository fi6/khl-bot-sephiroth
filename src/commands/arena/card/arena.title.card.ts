import { Card } from 'kbotify/dist/core/card';
import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';

export function arenaTitleCard(
    activeArena = 0,
    activePlayers: ArenaDoc['member'] = []
): Card {
    const nicknames: string = activePlayers.length
        ? activePlayers
              .map((player) => {
                  return player.nickname;
              })
              .join(', ')
        : '暂无';
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
                    type: 'kmarkdown',
                    content: `活跃房间：${activeArena}个 (更新于：${formatTime(
                        new Date()
                    )})\n活跃玩家：${nicknames}`,
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
                        value: '.欢迎 快捷 斗天梯',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '斗天梯',
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
                        content: '点击按钮以查看房间详情',
                    },
                ],
            },
        ],
    });
    return card;
}
