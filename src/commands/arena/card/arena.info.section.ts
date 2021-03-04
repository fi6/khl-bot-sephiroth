import { ArenaDoc } from '../../../models/Arena';
import { formatTime } from '../../../utils/format-time';
import { mentionUser } from '../../../utils/khl';
import { arenaCheckMember } from '../shared/arena.check-member';

export function arenaInfoModules(arena: ArenaDoc, khlId?: string): any[] {
    let memberString = '房间中还没有人。快来加入吧！';
    if (arena.member?.length) {
        let nickList = arena.member.map((member) => {
            return member.nickname;
        });
        memberString = nickList.join(', ') + ' 在房间中';
    }
    const buttonJoin = {
        type: 'button',
        theme: 'primary',
        value: `.房间 加入 ${arena.id}`,
        click: 'return-val',
        text: {
            type: 'plain-text',
            content: '加入',
        },
    };
    const buttonLeave = {
        type: 'button',
        theme: 'danger',
        value: `.房间 退出 ${arena.id}`,
        click: 'return-val',
        text: {
            type: 'plain-text',
            content: '退出',
        },
    };
    let button;
    let arenaContent;
    if (khlId && arenaCheckMember(arena, khlId)) {
        button = buttonLeave;
        arenaContent = `**房间号/密码**\n${arena.code} ${arena.password}`;
    } else {
        button = buttonJoin;
        arenaContent = `**房间号**\n${arena.code}`;
    }
    return [
        {
            type: 'header',
            text: {
                type: 'plain-text',
                content: `${arena.nickname} 的房间`,
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
                        content: arenaContent,
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
            accessory: button,
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
