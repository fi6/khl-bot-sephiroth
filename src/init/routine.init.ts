import schedule, { scheduleJob } from 'node-schedule';
import { updateArenaTitle } from '../commands/arena/shared/arena.update-list';
import { roleManager } from '../commands/profile/shared/profile.role-manager';

export const arenaCardJob = scheduleJob('0/10 * * * *', function () {
    updateArenaTitle();
});

export const roleJob = scheduleJob('30 0 0,8,18 * * *', function () {
    roleManager(new Date());
});
