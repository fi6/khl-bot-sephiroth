import arenaConfig from "configs/arena";
import Arena from "models/Arena";
import { ArenaData } from "../arena.types";

export async function arenaGetValid(data: ArenaData): Promise<ArenaData> {
    const arenaExpireTime = new Date(
        new Date().valueOf() - arenaConfig.expireTime
    );
    try {
        data.arenas = (await Arena.find({
            createdAt: {
                $gte: arenaExpireTime,
            },
        })
            .sort([['createdAt', -1]])
            .exec()) as [];
        return data;
    } catch (e) {
        console.error('Error when trying to find arena', e);
        throw e;
    }
    // console.log(arenas)
}
