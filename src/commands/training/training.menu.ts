import { BaseSession, Card, GuildSession, MenuCommand } from 'kbotify';
import configs from '../../configs';
import { trainingCheckin } from './training.checkin.app';
import { trainingCreate } from './training.create.app';
import { trainingJoin } from './training.join.app';
import { trainingLeave } from './training.leave.app';
import { trainingManage } from './training.manage.app';

class TrainingMenu extends MenuCommand {
    trigger = '教练房';
    menu = [trainingMenuCard()];
    useCardMenu = true;
    exec = async (s: BaseSession) => {
        const session = await GuildSession.fromSession(s, true);
        for (const role of [configs.roles.up, configs.roles.coach]) {
            if (session.user.roles?.includes(role)) {
                return await this.func(session);
            }
        }
        await session.sendTemp(
            '只有教练和Up主可以使用此功能。请向冰飞申请，以开放使用权。'
        );
        return;
    };
}

export const trainingMenu = new TrainingMenu(
    trainingCreate,
    trainingJoin,
    trainingLeave,
    trainingManage,
    trainingCheckin
);

function trainingMenuCard() {
    return new Card({
        type: 'card',
        theme: 'primary',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '教练房菜单',
                },
            },
            {
                type: 'action-group',
                elements: [
                    {
                        type: 'button',
                        theme: 'primary',
                        value: '.教练房 创建',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '创建教练房',
                        },
                    },
                    {
                        type: 'button',
                        theme: 'danger',
                        value: '.教练房 管理',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '管理教练房',
                        },
                    },
                ],
            },
        ],
    });
}
