import { BaseSession } from 'kbotify';
import { ArenaDoc } from 'models/ArenaLegacy';

export interface ArenaSession extends BaseSession {
    arena?: ArenaDoc | null;
    arenas?: ArenaDoc[] | null;
}
