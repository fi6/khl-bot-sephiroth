import { ArenaDoc } from '../../../models/ArenaLegacy';
import { infoModules } from './arena.info.section';

export function arenaAlertCard(arena: ArenaDoc): string {
    const card2 = {
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: infoModules(arena),
    };
    return JSON.stringify([card2]);
}

export function arenaAlertHelper() {
    let now = Date.now();
    return JSON.stringify([
        {
            type: 'card',
            theme: 'secondary',
            size: 'lg',
            modules: [
                {
                    type: 'section',
                    text: {
                        type: 'plain-text',
                        content:
                            '请输入广播留言，输入后将自动进行广播。如需取消，请点击按钮。',
                    },
                    mode: 'right',
                    accessory: {
                        type: 'button',
                        theme: 'danger',
                        click: 'return-val',
                        value: '.房间 广播 cancel',
                        text: {
                            type: 'plain-text',
                            content: '取消广播',
                        },
                    },
                },
                {
                    type: 'countdown',
                    mode: 'second',
                    startTime: now,
                    endTime: now + 60 * 1e3,
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'plain-text',
                            content: '广播房间会发送@全体，请不要过度使用哦',
                        },
                    ],
                },
            ],
        },
    ]);
}
