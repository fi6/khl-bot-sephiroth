export function arenaManageCard() {
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
                        content: '房间管理',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: '你也可以直接发送`.关房`关闭房间',
                    },
                },
                {
                    type: 'action-group',
                    elements: [
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.房间 管理 关闭',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '关闭房间',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.房间 广播',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '广播',
                            },
                        },
                    ],
                },
            ],
        },
    ];
}
