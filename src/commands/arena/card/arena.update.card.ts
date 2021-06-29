import { Card } from 'kbotify/dist/core/card';
import { ArenaDoc } from '../../../models/Arena';

export function arenaUpdateCard(arena: ArenaDoc) {
    return [new Card()];
}
