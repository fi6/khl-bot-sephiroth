import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify';
import { logger } from '../../init/logger';
import DioEvent from '../../models/DioEvent';

class EventCreate extends AppCommand {
    trigger = 'create';
    func: AppFunc<BaseSession> = async (s) => {
        const session = await GuildSession.fromSession(s, true);
        session.updateMessage(
            '8acc245e-d7ab-4d15-b49b-cbf3717462f7',
            new Card({
                type: 'card',
                theme: 'info',
                size: 'lg',
                modules: [
                    {
                        type: 'header',
                        text: {
                            type: 'plain-text',
                            content: '活动报名',
                        },
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'kmarkdown',
                            content:
                                '角色表演赛即将于本周五晚9点开始！[DioTV直播间地址](https://live.bilibili.com/9900640)\n在表演赛结束后(约10点30），本期嘉宾 **Boo☆XZQ** 将会和大家进行简短的切磋交流。',
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
                                '如果你有兴趣参与，请点击下方按钮进行报名。',
                        },
                    },
                    {
                        type: 'action-group',
                        elements: [
                            {
                                type: 'button',
                                theme: 'success',
                                value: '.活动 报名 dio-show-inkling',
                                click: 'return-val',
                                text: {
                                    type: 'plain-text',
                                    content: '我要报名！',
                                },
                            },
                        ],
                    },
                ],
            }).toString()
        );
        const event = await DioEvent.create({
            code: 'dio-show-bayonetta',
            title: 'DioTV 表演赛 BAYONETTA',
            members: [],
        });
        logger.info('event created', event);
    };
}

export const eventCreate = new EventCreate();
