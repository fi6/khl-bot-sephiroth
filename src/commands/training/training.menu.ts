import { ArenaData } from 'commands/arena/arena.types';
import { MenuCommand } from 'kbotify';

class TrainingMenu extends MenuCommand<ArenaData> {
    trigger = '特训';
}
