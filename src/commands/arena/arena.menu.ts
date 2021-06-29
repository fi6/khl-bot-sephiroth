import { BaseSession, MenuCommand } from 'kbotify';
import { arenaAlert } from './arena.alert.app';
import { arenaCreate } from './arena.create.app';
import { arenaManage } from './arena.manage.app';
import { arenaJoin } from './arena.join.app';
import { arenaList } from './arena.list.app';
import { ArenaSession } from './arena.types';
import { arenaLeave } from './arena.leave.app';
import { arenaTitle } from './arena.title.app';

const content = ''.concat(
    '> **房间功能使用帮助**\n\r',
    '```\n【创建房间】将房间添加至房间列表（覆盖自己的）\n[.建房/.开房 房间号 密码 房间信息 留言]\n[.房间 创建 房间号 密码 房间信息 留言]```\n',
    '```\n【查看房间】查看房间列表中的房间\n[.找房]\n[.房间 查看]```\n',
    '```\n【关闭房间】删除房间列表中自己的房间\n[.关房]\n[.房间 关闭/删除]```\n',
    '```\n【广播找人】将自己创建的房间发送广播提醒\n[.房间 广播 广播语]```\n',
    '```\n【特训】：教练组专属，可自动发送提醒，其他人需排队加入房间。\n[.房间 特训 房间号 密码 加速 人数限制 留言]\n[.房间 管理], [.房间 排队 @房主]```'
);

class ArenaMenu extends MenuCommand {
    code = 'arena';
    trigger = '房间';
    help = content;
    useCardMenu = true;
    menu = cardMenu();
    async exec(session: BaseSession) {
        // console.log(session);
        return await this.func(session);
    }
}

export const arenaMenu = new ArenaMenu(
    arenaCreate,
    arenaList,
    arenaManage,
    arenaAlert,
    arenaJoin,
    arenaLeave,
    arenaTitle
);

function cardMenu() {
    return JSON.stringify([
        {
            type: 'card',
            theme: 'info',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '房间菜单',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content:
                            '- 创建房间：创建一个房间，将覆盖已创建的房间\n- 管理房间：管理已创建的房间，如关闭或广播\n- 查看房间列表：查看所有开放中的房间',
                    },
                },
                {
                    type: 'action-group',
                    elements: [
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.房间 创建',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '创建房间',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.房间 管理',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '管理房间',
                            },
                        },
                        {
                            type: 'button',
                            theme: 'primary',
                            value: '.房间 查看',
                            click: 'return-val',
                            text: {
                                type: 'plain-text',
                                content: '查看房间列表',
                            },
                        },
                    ],
                },
            ],
        },
    ]);
}
