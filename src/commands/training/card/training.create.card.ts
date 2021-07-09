import { Card } from 'kbotify';
import { ArenaDoc } from '../../../models/Arena';
import { TrainingArenaDoc } from '../../../models/TrainingArena';
import { formatTime } from '../../../utils/format-time';

export function createTrainingHelpCard(oldArena: ArenaDoc | null) {
    const now = Date.now();
    let example = '例: `5F23C  147  裸连3人  今天不语音，打完给大家发小作文`';
    // if (oldArena) {
    //     example =
    //         '上次的房间信息：`' +
    //         [
    //             oldArena.code,
    //             oldArena.password,
    //             oldArena.info,
    //             oldArena.title,
    //         ].join(' ') +
    //         '`\n房间号为必填，其他为选填。系统会自动继承上次的房间信息。';
    // }
    return new Card({
        type: 'card',
        theme: 'info',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '创建房间',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content:
                        '请输入`房间号  密码  房间信息  房间留言`，用空格分开。',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: example,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: '**房间留言很重要，不要写"随便打打"**',
                },
            },
            {
                type: 'countdown',
                mode: 'second',
                startTime: now,
                endTime: now + 120 * 1e3,
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain-text',
                        content: '请在倒计时结束前完成输入。',
                    },
                ],
            },
        ],
    });
}
