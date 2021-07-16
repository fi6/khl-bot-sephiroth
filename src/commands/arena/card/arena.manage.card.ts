import { BaseSession, Card } from 'kbotify';
import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';

export function arenaManageCard(arena: ArenaDoc, coach = false) {
    const expireCard = [];
    if (arena.expired)
        expireCard.push(
            new Card()
                .setTheme('warning')
                .addText(
                    '你的房间已关闭，不会显示在房间列表中。你可以重新创建。'
                )
        );
    const memberCard = new Card().setTheme('primary').addTitle('成员管理');
    if (!arena.member.length)
        memberCard.addText(
            '暂时没有成员……你可以点击广播，ヒカリ将自动发送广播信息至各个微信、QQ群'
        );
    for (const item of arena.member) {
        memberCard.addModule({
            type: 'section',
            text: {
                type: 'plain-text',
                content: `${item.nickname}`,
            },
            mode: 'right',
            accessory: {
                type: 'button',
                theme: 'danger',
                click: 'return-val',
                value: `.房间 管理 kick ${item._id}`,
                text: {
                    type: 'plain-text',
                    content: '踢出玩家',
                },
            },
        });
    }

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
                        content:
                            '**房间已满时无法加入**，需要踢出玩家恢复空位。你也可以手动暂停加入。\n当前人数：' +
                            `${arena.member.length + 1}/${arena.limit}`,
                    },
                },
                {
                    type: 'divider',
                },
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: `${arena.header} (${
                            arena.join ? '允许加入中' : '已暂停加入'
                        }${arena.full ? ', 已满' : ''})`,
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
                    type: 'action-group',
                    elements: [
                        {
                            type: 'button',
                            theme: arena.public ? 'warning' : 'primary',
                            value: `.房间 管理 public ${
                                arena.public ? '0' : '1'
                            }`,
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: arena.public
                                    ? '取消公开密码'
                                    : '公开密码',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'info',
                            value: `.房间 广播`,
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '进行广播',
                            },
                        },
                        ...(coach
                            ? [
                                  {
                                      type: 'button',
                                      theme: 'primary',
                                      value: `.教练房 创建`,
                                      click: 'return-val',
                                      text: {
                                          type: 'plain-text',
                                          content: '创建教练房',
                                      },
                                  },
                              ]
                            : []),
                    ],
                },
            ],
        }),
        memberCard,
    ];
}
