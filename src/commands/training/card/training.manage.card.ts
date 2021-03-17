import TrainingArena, { TrainingArenaDoc } from '../../../models/TrainingArena';
import { formatTime } from '../../../utils/format-time';

export const trainingManageCard = (
    arena: TrainingArenaDoc,
    content: string = ''
) => {
    arena.queue.sort((a, b) => {
        return a.time.valueOf() - b.time.valueOf();
    });
    const modules: unknown[] = [];
    arena.queue.forEach((user) => {
        if (user.state != -1) modules.push(kickModule(user));
    });

    // button: open / close register
    let button;
    if (arena.register == true) {
        button = {
            type: 'button',
            theme: 'danger',
            value: '.教练房 管理 register off',
            click: 'return-val',
            text: {
                type: 'plain-text',
                content: '关闭注册',
            },
        };
    } else {
        button = {
            type: 'button',
            theme: 'success',
            value: '.教练房 管理 register on',
            click: 'return-val',
            text: {
                type: 'plain-text',
                content: '开启注册',
            },
        };
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
                        content: '教练房管理',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content:
                            `房间信息：${arena.code} ${arena.password} ${arena.connection}\n` +
                            content,
                    },
                },
                {
                    type: 'action-group',
                    elements: [
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.教练房 管理 call',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '呼叫下一位',
                            },
                        },
                        button,
                    ],
                },
                ...modules,
            ],
        },
    ];
};

function kickModule(user: TrainingArenaDoc['queue'][number]) {
    // let inArena = ' ';
    // if (index < 3) {
    //     inArena = ' 在房间中';
    // }
    let state = '';
    if (user.state == 1) {
        state = ' (已呼叫)';
    } else if (user.state == 2) {
        state = ' (已签到)';
    }
    return {
        type: 'section',
        text: {
            type: 'plain-text',
            content: `${user.number} ${user.nickname} \t游戏名：${user.gameName}${state}`,
        },
        mode: 'right',
        accessory: {
            type: 'button',
            theme: 'primary',
            value: `.教练房 管理 kick ${user._id}`,
            click: 'return-val',
            text: {
                type: 'plain-text',
                content: '踢出',
            },
        },
    };
}
