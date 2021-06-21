export function kaiheilaCard() {
    return {
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '开黑啦怎么用？',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '请先点击开始使用，在开放服务器功能后再阅读以下内容。',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '· 点击左上角可以切换频道。现在，你应该可以看到闲聊频道。聊天等内容就会在闲聊频道内进行。\n· 如需使用斗天梯，请在 (chn)8769493745666772(chn) 点击按钮启动。\n· 除了这样的文字频道，开黑啦还有语音频道——你可以理解为语音房间。想和小伙伴语音的话，可以加入同一个语音频道。\n· 如果你需要设置推送通知，请点击左上角的服务器名，然后选择“通知设定”。\n· 使用上遇到任何问题，请在答疑/反馈频道联系我们。',
                },
            },
        ],
    };
}
