import { Card } from 'kbotify';
import { TrainingArenaDoc } from '../../../models/TrainingArena';

export const trainingManageCard = (arena: TrainingArenaDoc) => {
    arena.sortQueue();
    const modules: unknown[] = [];
    arena.queue.forEach((user) => {
        if (user.state != -1) modules.push(memberModule(user));
    });

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
                        content: '教学房间管理',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: '开黑啦是最好的~~语音~~软件:smile:',
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
                                content: `**房间信息**\n${arena.info}`,
                            },
                            {
                                type: 'kmarkdown',
                                content: `**排队状态**\n${
                                    arena.join ? '允许排队' : '停止排队'
                                }`,
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
                            value: `.教练房 管理 join ${
                                arena.join ? '0' : '1'
                            }`,
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: arena.join ? '停止排队' : '允许排队',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'info',
                            value: '.教练房 管理 info',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '更新房间信息',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: 'ok',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '呼叫',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: 'ok',
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
                            theme: 'primary',
                            value: 'ok',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '呼叫下一名',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: 'ok',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '呼叫序号',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: 'ok',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '设置结束序号',
                            },
                        },
                    ],
                },
            ],
        }),
        new Card({
            type: 'card',
            theme: 'secondary',
            size: 'lg',
            modules: [...modules],
        }),
    ];
};

function memberModule(user: TrainingArenaDoc['queue'][number]) {
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
            content: `${user.number} ${user.nickname} ${state}`,
        },
        mode: 'right',
        accessory: {
            type: 'button',
            theme: 'primary',
            value: `.教练房 管理 call ${user._id}`,
            click: 'return-val',
            text: {
                type: 'plain-text',
                content: '呼叫',
            },
        },
    };
}
