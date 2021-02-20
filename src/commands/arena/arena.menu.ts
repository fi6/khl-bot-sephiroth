import { trainingCreate } from 'commands/training/training.create.app';
import { trainingJoin } from 'commands/training/training.join.app';
import { trainingLeave } from 'commands/training/training.leave.app';
import { trainingManage } from 'commands/training/training.manage.app';
import { MenuCommand } from 'kbotify';
import { arenaCreate } from './arena.create.app';
import { arenaDelete } from './arena.delete.app';
import { arenaList } from './arena.list.app';
import { ArenaSession } from './arena.types';

const content = ''.concat(
    '> **房间功能使用帮助**\n\r',
    '```\n【创建房间】将房间添加至房间列表（覆盖自己的）\n[.建房/.开房 房间号 密码 房间信息 留言]\n[.房间 创建 房间号 密码 房间信息 留言]```\n',
    '```\n【查看房间】查看房间列表中的房间\n[.找房]\n[.房间 查看]```\n',
    '```\n【关闭房间】删除房间列表中自己的房间\n[.关房]\n[.房间 关闭/删除]```\n',
    '```\n【广播找人】将自己创建的房间发送广播提醒\n[.房间 广播 广播语]```\n',
    '```\n【特训】：教练组专属，可自动发送提醒，其他人需排队加入房间。\n[.房间 特训 房间号 密码 加速 人数限制 留言]\n[.房间 管理], [.房间 排队 @房主]```'
);

class ArenaMenu extends MenuCommand<ArenaSession> {
    code = 'arena';
    trigger = '房间';
    help = content;
}

export const arenaMenu = new ArenaMenu(
    arenaCreate,
    arenaDelete,
    arenaList,
    trainingCreate,
    trainingJoin,
    trainingLeave,
    trainingManage
);
