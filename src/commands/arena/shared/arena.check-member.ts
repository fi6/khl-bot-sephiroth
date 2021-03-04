import { Session } from 'inspector';
import { ArenaDoc } from '../../../models/Arena';

export function arenaCheckMember(arena: ArenaDoc, khlId: string): boolean {
    if (!arena.member?.length) {
        return false;
    }
    arena.member.forEach((user) => {
        if (user._id == khlId) return true;
    });
    return false;
}
