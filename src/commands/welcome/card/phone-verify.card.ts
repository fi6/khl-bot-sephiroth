export function verifyCard() {
    return {
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '开始使用',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '欢迎加入斗天堂服务器！',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '**请完成手机认证**，然后点击按钮继续。非手机认证的账户为临时账户，无法发言，也无法使用房间功能。',
                },
            },
            {
                type: 'action-group',
                elements: [
                    {
                        type: 'button',
                        theme: 'success',
                        value: '.欢迎 开始 2',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '认证好了',
                        },
                    },
                ],
            },
        ],
    };
}
