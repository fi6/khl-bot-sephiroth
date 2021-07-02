import schedule, { scheduleJob } from 'node-schedule';
import { updateArenaTitle } from '../commands/arena/shared/arena.update-list';
import { voiceChannelManager } from '../commands/arena/shared/arena.voice-manager';
import { roleManager } from '../commands/profile/shared/profile.role-manager';
import { channels } from '../configs';
import bot from './bot_init';

export const arenaCardJob = scheduleJob('0/10 * * * *', function () {
    updateArenaTitle();
});

export const arenaCleanJob = scheduleJob('0/20 * * * *', function () {
    voiceChannelManager.recycleUnused();
});

export const roleJob = scheduleJob('30 0 0,8,18 * * *', function () {
    roleManager(new Date());
});

// const testJob = scheduleJob(new Date(new Date().valueOf() + 2e4), function () {
//     bot.API.message.create(9, channels.chat, 'test1', undefined, '2321962160');
// });

// const testJob2 = scheduleJob(new Date(new Date().valueOf() + 4e4), () => {
//     bot.API.message.create(9, channels.chat, 'test1', undefined, '2321962160');
// });
