import { Session } from 'inspector';
import { ArenaDoc } from '../../../models/ArenaLegacy';

export function arenaCheckMember(arena: ArenaDoc, khlId: string): boolean {
    if (!arena.member?.length) {
        return false;
    }
    const validation = arena.member.map((user) => {
        // console.debug(user._id, khlId);
        if (user._id === khlId) {
            return true;
        }
    });
    if (validation.includes(true)) return true;
    return false;
}
