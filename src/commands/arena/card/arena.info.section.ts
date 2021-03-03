import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';
import { mentionUser } from '../../../utils/khl';

export function arenaInfoModules(arena: ArenaDoc): any[] {
    let memberString = '房间中还没有人。快来加入吧！';
    if (arena.member?.length) {
        let nickList = arena.member.map((member) => {
            return member.userNick;
        });
        memberString = nickList.join(', ') + ' 在房间中';
    }
    return [
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
                        content: `**房间号**\n${arena.arenaId}`,
                    },
                    {
                        type: 'kmarkdown',
                        content: `**房间信息**\n${arena.arenaInfo ?? ''}`,
                    },
                    {
                        type: 'kmarkdown',
                        content: `**创建时间**\n${formatTime(arena.createdAt)}`,
                    },
                ],
            },
            mode: 'right',
            accessory: {
                type: 'button',
                theme: 'primary',
                value: `.房间 加入 ${arena.id}`,
                click: 'return-val',
                text: {
                    type: 'plain-text',
                    content: '加入',
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
    ];
}
