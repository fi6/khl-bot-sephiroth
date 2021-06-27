import { AppCommand, AppFunc, BaseSession } from 'kbotify';
import { channels } from '../../configs';
import arenaConfig from '../../configs/arena';
import bot from '../../init/bot_init';
import { arenaMainCard, arenaTitleCard } from './card/arena.title.card';

class ArenaTitle extends AppCommand {
    trigger = 'title';
    func: AppFunc<BaseSession> = async (session) => {
        await session.updateMessage(
            arenaConfig.titleCardId,
            `[${arenaTitleCard().toString()}]`
        );

        await session.updateMessage(
            arenaConfig.mainCardId,
            `[${arenaMainCard().toString()}]`
        );
    };
}

export const arenaTitle = new ArenaTitle();
