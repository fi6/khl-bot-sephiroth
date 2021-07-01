import arenaConfig from 'configs/arena';
// import ArenaLegacy, { ArenaDoc } from 'models/ArenaLegacy';
import Arena, { ArenaDoc } from 'models/Arena';

export async function arenaGetValid() {
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
        })
            .sort([['updatedAt', -1]])
            .exec();
        return rawArenas;
    } catch (e) {
        console.error('Error when trying to find arena', e);
        throw e;
    }
    // console.log(arenas)
}
