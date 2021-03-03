import schedule, { scheduleJob } from 'node-schedule';
import { updateArenaList } from '../commands/arena/shared/arena.update-list';

export const job = scheduleJob('0/5 * * * *', function () {
    updateArenaList();
});
