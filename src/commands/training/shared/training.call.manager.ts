import { EventEmitter } from 'events';
import LRUCache from 'lru-cache';

const cache = new LRUCache<string, boolean>({ max: 16, maxAge: 330 * 1e3 });

class TrainingCallManager extends EventEmitter {
    call(userId: string) {
        cache.set(userId, false);
        setTimeout(() => {
            if (cache.get(userId) === false) {
                this.emit('fail', userId);
                cache.del(userId);
            }
        }, 5 * 6e4);
    }
    response(userId: string) {
        cache.set(userId, true);
        console.debug('user check-in ', userId);
    }
}

export const trainingCallManager = new TrainingCallManager();
