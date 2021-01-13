import arenaConfig from 'configs/arena';
import Arena, { ArenaDoc } from 'models/Arena';

export async function arenaGetValid(): Promise<ArenaDoc[]> {
    const arenaExpireTime = new Date(
        new Date().valueOf() - arenaConfig.expireTime
    );
    try {
        const arenas = (await Arena.find({
            createdAt: {
                $gte: arenaExpireTime,
            },
        })
            .sort([['createdAt', -1]])
            .exec()) as [];
        return arenas;
    } catch (e) {
        console.error('Error when trying to find arena', e);
        throw e;
    }
    // console.log(arenas)
}
