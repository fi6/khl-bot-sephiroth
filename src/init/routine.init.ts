import schedule, { scheduleJob } from 'node-schedule';
import { updateArenaList } from '../commands/arena/shared/arena.update-list';
import { roleManager } from '../commands/profile/shared/profile.role-manager';

export const arenaCardJob = scheduleJob('0/10 * * * *', function () {
    updateArenaList();
});

export const roleJob = scheduleJob('30 0 0,8,18 * * *', function () {
    roleManager(new Date());
});
