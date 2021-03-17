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
        {
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
                        content: `(met)${user._id}(met) 请于5分钟内进入${arena.nickname}的语音频道，然后点击签到按钮。签到成功后将显示房间信息。`,
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
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: `房间号：${arena.code}, 密码：${arena.password}, 连接方式：${arena.connection}`,
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content:
                            '在前一名玩家特训结束后请上台与教练进行对战。在对战前请在台下等候，避免进入观战，防止卡顿。',
                    },
                },
            ],
        },
    ];
}
