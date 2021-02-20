import { ArenaSession } from 'commands/arena/arena.types';
import { MenuCommand } from 'kbotify';

class TrainingMenu extends MenuCommand<ArenaSession> {
    trigger = '特训';
}
