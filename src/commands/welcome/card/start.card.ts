import { channel } from '../../../configs';

export function startCard() {
    return {
        type: 'card',
        theme: 'success',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '服务器功能开启',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: `欢迎加入斗天堂！已为你开启服务器功能。\n手机版请点击左上角查看频道。先试着在 (chn)${channel.chat}(chn) 和大家打个招呼吧！`,
                },
            },
        ],
    };
}
