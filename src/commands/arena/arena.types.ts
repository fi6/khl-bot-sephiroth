import { BaseSession } from 'kbotify';
import { ArenaDoc } from 'models/Arena';

export interface ArenaSession extends BaseSession {
    arena?: ArenaDoc | null;
    arenas?: ArenaDoc[] | null;
}
