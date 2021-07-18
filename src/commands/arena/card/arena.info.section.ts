import { ArenaDoc } from '../../../models/Arena';

export function infoModules(
    arena: ArenaDoc,
    khlId?: string,
    showPassword = false
): any[] {
    return arena.toInfoModule(khlId, showPassword);
}
