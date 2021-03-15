import { ArenaSession } from 'commands/arena/arena.types';
import { MenuCommand } from 'kbotify';
import { trainingCheckin } from './training.checkin.app';
import { trainingCreate } from './training.create.app';
import { trainingJoin } from './training.join.app';
import { trainingLeave } from './training.leave.app';
import { trainingManage } from './training.manage.app';

class TrainingMenu extends MenuCommand {
    trigger = '教练房';
    menu = '教练房menu';
}

export const trainingMenu = new TrainingMenu(
    trainingCreate,
    trainingJoin,
    trainingLeave,
    trainingManage,
    trainingCheckin
);
