import arenaConfig from '../../../configs/arena';
import bot from '../../../init/bot_init';
import { arenaGetValid } from './arena.get-valid';

const card = arenaConfig.arenaCardId;

export async function updateArenaCard() {
    const arenas = await arenaGetValid()
    
}