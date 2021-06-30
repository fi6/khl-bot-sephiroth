import { Card } from 'kbotify/dist/core/card';
import { ArenaDoc } from '../../../models/Arena';

export function arenaUpdateCard(arena: ArenaDoc) {
    const currentInfo = [
        arena.code,
        arena.password,
        arena.info,
        arena.title,
    ].join(' ');
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
                        content: '房间信息更新',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: `你当前的房间信息(房间号 密码 房间信息 房间名) \`${currentInfo}\``,
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: `请**按顺序**输入新的房间信息，用空格分开。**房间号为必填**，其余不填则保持不变。`,
                    },
                },
                {
                    type: 'countdown',
                    mode: 'second',
                    startTime: new Date().valueOf(),
                    endTime: new Date().valueOf() + 120 * 1e3,
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'plain-text',
                            content: '你可以复制上方文字，然后进行修改即可',
                        },
                    ],
                },
            ],
        }),
    ];
}
