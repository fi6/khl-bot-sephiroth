import { Card } from 'kbotify';
import { channels } from '../../../configs';

export function startCard() {
    return new Card({
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
                    content: `欢迎加入斗天堂！已为你开启服务器功能。\n手机版请点击左上角查看频道。先试着在 (chn)${channels.chat}(chn) 和大家打个招呼吧！`,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: `参与DioTV活动请点击紫色字->(chn)1104525558162107(chn)`,
                },
            },
        ],
    });
}
