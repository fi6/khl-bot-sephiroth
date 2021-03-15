import { TrainingArenaDoc } from '../../../models/TrainingArena';

export function trainingArenaSort(arena: TrainingArenaDoc) {
    arena.queue.sort((a, b) => {
        return a.time.valueOf() - b.time.valueOf();
    });
}
