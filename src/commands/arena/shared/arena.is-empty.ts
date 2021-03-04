import { ArenaDoc } from '../../../models/Arena';

/**
 * return true if arena is empty else
 *
 * @param arena
 * @returns
 */
export function arenaIsEmpty(arena: ArenaDoc) {
    if (!arena.member.length) {
        return true;
    }
    return false;
}