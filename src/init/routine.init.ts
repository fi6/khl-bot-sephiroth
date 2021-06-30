import schedule, { scheduleJob } from 'node-schedule';
import { updateArenaTitle } from '../commands/arena/shared/arena.update-list';
import { voiceChannelManager } from '../commands/arena/shared/arena.voice-manage';
import { roleManager } from '../commands/profile/shared/profile.role-manager';

export const arenaCardJob = scheduleJob('0/10 * * * *', function () {
    updateArenaTitle();
});

export const arenaCleanJob = scheduleJob('0/20 * * * *', function () {
    voiceChannelManager.recycleUnused();
});

export const roleJob = scheduleJob('30 0 0,8,18 * * *', function () {
    roleManager(new Date());
});
