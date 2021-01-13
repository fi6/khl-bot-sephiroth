import { BaseData } from "kbotify";
import { ArenaDoc } from "models/Arena";

export interface ArenaData extends BaseData {
    arena?: ArenaDoc | null;
    arenas?: ArenaDoc[] | null;
}