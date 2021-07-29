import { Card, MenuCommand } from 'kbotify';
import configs from '../../configs';
import { eventCreate } from './event.create.app';
import { eventRegister } from './event.register.app';

class EventMenu extends MenuCommand {
    trigger = '活动';
    menu = [];
}

export const eventMenu = new EventMenu(eventCreate, eventRegister);
