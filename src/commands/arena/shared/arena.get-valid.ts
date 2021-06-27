import arenaConfig from 'configs/arena';
import Arena, { ArenaDoc } from 'models/Arena';

export async function arenaGetValid(): Promise<ArenaDoc[]> {
    const arenaExpireTime = new Date(
        new Date().valueOf() - arenaConfig.expireTime
    );
    const emptyCreateTime = new Date(
        new Date().valueOf() - arenaConfig.allowedEmptyTime
    );
    try {
        const rawArenas = (await Arena.find({
            expireAt: {
                $gte: Date().valueOf(),
            },
        })
            .sort([['expireAt', -1]])
            .exec()) as [];
        return rawArenas;
    } catch (e) {
        console.error('Error when trying to find arena', e);
        throw e;
    }
    // console.log(arenas)
}
