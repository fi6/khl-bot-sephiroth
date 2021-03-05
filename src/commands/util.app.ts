import { AppCommand, AppCommandFunc, BaseSession } from 'kbotify';
import Arena from 'models/Arena';
import { updateArenaList } from './arena/shared/arena.update-list';

class UtilApp extends AppCommand {
    code = 'list';
    trigger = 't';
    intro = '查看房间';
    help = '';
    func: AppCommandFunc<BaseSession> = async (session) => {
        await session.sendCard(JSON.stringify(shorcut()));
        // await session.sendCard(JSON.stringify(card()));
        // await session.sendCard(JSON.stringify([card2()]));
        // updateArenaList()
        return;
    };
}

export const utilApp = new UtilApp();

function shorcut() {
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
                        content: '快捷菜单',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content:
                            '在 (chn)4873200132116685(chn) 发送`房间`可打开完整房间菜单。',
                    },
                },
                {
                    type: 'action-group',
                    elements: [
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.欢迎 快捷 建房',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '创建房间',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.欢迎 快捷 找房',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '更新房间列表',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.欢迎 快捷 斗天梯',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '斗天梯',
                            },
                        },
                    ],
                },
            ],
        },
    ];
}

function card() {
    return [
        {
            type: 'card',
            theme: 'primary',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '你好！',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content:
                            '欢迎加入斗天堂の日常！\n我们为你准备了房间组队，斗天梯，视频推送等多个机器人，希望你能在这里享受大乱斗带来的快乐！',
                    },
                },
            ],
        },
        // {
        //     type: 'card',
        //     theme: 'warning',
        //     size: 'lg',
        //     modules: [
        //         {
        //             type: 'header',
        //             text: {
        //                 type: 'plain-text',
        //                 content: '我该做什么？',
        //             },
        //         },
        //         {
        //             type: 'section',
        //             text: {
        //                 type: 'kmarkdown',
        //                 content:
        //                     '**请现在完成手机认证**，否则无法发言，也就无法正常使用机器人。\n此外，手机网页版功能不全，建议下载开黑啦App或使用电脑网页版。',
        //             },
        //         },
        //     ],
        // },
        // {
        //     type: 'card',
        //     theme: 'success',
        //     size: 'lg',
        //     modules: [
        //         {
        //             type: 'header',
        //             text: {
        //                 type: 'plain-text',
        //                 content:
        //                     '我已经认证好了，也下载了客户端/使用电脑，然后呢？',
        //             },
        //         },
        //         {
        //             type: 'section',
        //             text: {
        //                 type: 'kmarkdown',
        //                 content:
        //                     '请阅读以下内容，然后点按钮确认。确认后即开启服务器功能，你可以切换其他频道查看。',
        //             },
        //         },
        //         {
        //             type: 'divider',
        //         },
        //         {
        //             type: 'section',
        //             text: {
        //                 type: 'kmarkdown',
        //                 content: '**服务器使用守则**',
        //             },
        //         },
        //         {
        //             type: 'section',
        //             text: {
        //                 type: 'kmarkdown',
        //                 content:
        //                     '1. 所有发言必须建立在互相尊重的基础上。任何公开的人身攻击等都可能导致被踢并拉黑。',
        //             },
        //         },
        //         {
        //             type: 'section',
        //             text: {
        //                 type: 'kmarkdown',
        //                 content:
        //                     '2. 请在对应的频道讨论对应的话题，比如关于使用的疑问和反馈请在反馈/交流频道。',
        //             },
        //         },
        //         {
        //             type: 'section',
        //             text: {
        //                 type: 'kmarkdown',
        //                 content: '**开始使用说明你已确认并遵守以上内容**',
        //             },
        //         },
        //     ],
        // },
    ];
}

function card2() {
    return {
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'action-group',
                elements: [
                    {
                        type: 'button',
                        theme: 'success',
                        value: '.欢迎 开始 1',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '开始使用！',
                        },
                    },
                    {
                        type: 'button',
                        theme: 'info',
                        value: '.欢迎 开黑啦',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '开黑啦使用简介',
                        },
                    },
                ],
            },
        ],
    };
}
