import { Card } from 'kbotify';
import { ArenaDoc } from '../../../models/Arena';

function arenaJoinCard(arena: ArenaDoc) {
    return new Card({
        type: 'card',
        theme: 'secondary',
        size: 'lg',
        modules: [
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: '开黑啦是最好的~~语音~~软件:smile:',
                },
            },
            { type: 'invite', code: arena.invite },
        ],
    });
}
