import arenaConfig from 'configs/arena';
// import Arena, { ArenaDoc } from 'models/Arena';
import Arena, { ArenaDoc } from 'models/Arena';
import { logger } from '../../../init/logger';

export async function arenaGetValid(): Promise<ArenaDoc[]> {
    const arenaExpireTime = new Date(
        new Date().valueOf() - arenaConfig.expireTime
    );
    const emptyCreateTime = new Date(
        new Date().valueOf() - arenaConfig.allowedEmptyTime
    );
    try {
        const rawArenas = await Arena.find({
            expireAt: {
                $gte: new Date(),
            },
        }).exec();
        rawArenas.sort((a, b) => {
            if (a.__t === 'TrainingArena' && b.__t !== 'TrainingArena')
                return -1;
            if (a.updatedAt === b.updatedAt) return 0;
            return a.updatedAt > b.updatedAt ? -1 : 1;
        });
        return rawArenas;
    } catch (e) {
        logger.error('Error when trying to find arena', e);
        throw e;
    }
    // console.log(arenas)
}
