export function termCard() {
    return {
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '使用守则',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '为了保障大家都能开心的交流，我们为服务器设定了一些基本守则。',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '1. 所有发言必须建立在互相尊重的基础上；\n2. 做个成熟、有情商的人，拒绝杠精；\n3. 请在对应的频道讨论对应的话题；\n4. 认真阅读以上3条。',
                },
            },
            {
                type: 'divider',
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '如果你滥用机器人或公开进行人身攻击等，我们会将你踢出并拉黑。\n请谨言慎行！',
                },
            },
            {
                type: 'action-group',
                elements: [
                    {
                        type: 'button',
                        theme: 'success',
                        value: '.欢迎 开始 3',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '好的！',
                        },
                    },
                ],
            },
        ],
    };
}
