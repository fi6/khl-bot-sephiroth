import { Card } from 'kbotify';
import { TrainingArenaDoc } from '../../../models/TrainingArena';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function trainingCallCard(arena: TrainingArenaDoc, userId: string) {
    const user = arena.queue.find((usr) => {
        return usr._id === userId;
    });
    if (!user) {
        console.error(user, arena);
        throw new Error('user not in arena');
    }

    return [
        new Card({
            type: 'card',
            theme: 'warning',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '教练房提醒',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: `(met)${user._id}(met) 请于3分钟内点击签到按钮，签到成功后将显示房间信息和语音频道。`,
                    },
                    mode: 'right',
                    accessory: {
                        type: 'button',
                        theme: 'primary',
                        click: 'return-val',
                        value: `.教练房 签到 ${arena._id}`,
                        text: {
                            type: 'plain-text',
                            content: '签到',
                        },
                    },
                },
                // {
                //     type: 'section',
                //     text: {
                //         type: 'kmarkdown',
                //         content: `房间号：${arena.code}, 密码：${arena.password}, 连接方式：${arena.connection}`,
                //     },
                // },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content:
                            '在对战前请在擂台外侧等候，尽量避免进入观战，防止卡顿。',
                    },
                },
            ],
        }),
    ];
}
