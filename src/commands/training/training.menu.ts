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
            if (session.user.roles?.includes(role)) return this.func(session);
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
    return new Card().setTheme('primary').addTitle('教练房菜单');
}
