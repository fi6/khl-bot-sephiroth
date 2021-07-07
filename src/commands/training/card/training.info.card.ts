import { TrainingArenaDoc } from '../../../models/TrainingArena';
import { parseCard } from '../../../utils/card-parser';
import { formatTime } from '../../../utils/format-time';

export function trainingInfoCard(arena: TrainingArenaDoc): string {
    const currentCalled: string[] = [];
    let calledString = '暂无';
    if (arena.queue?.length) {
        arena.queue.forEach((user) => {
            if (user.state == 1) {
                currentCalled.push(`${user.number} ${user.nickname}`);
            }
        });
        if (currentCalled.length) calledString = currentCalled.join(', ');
    }

    const card = [
        {
            type: 'card',
            theme: 'warning',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '教练房信息',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: `**${arena.nickname}的教练房**\n${arena.info}`,
                    },
                    mode: 'left',
                    accessory: {
                        type: 'image',
                        src: arena.avatar,
                        size: 'sm',
                        circle: true,
                    },
                },
                {
                    type: 'divider',
                },
                {
                    type: 'section',
                    text: {
                        type: 'paragraph',
                        cols: 3,
                        fields: [
                            {
                                type: 'kmarkdown',
                                content: `**开始时间**\n${formatTime(
                                    arena.schedule
                                )}`,
                            },
                            {
                                type: 'kmarkdown',
                                content: `**网络信息**\n${arena.info}`,
                            },
                            {
                                type: 'kmarkdown',
                                content: `**报名人数**\n${arena.queue.length}/${arena.limit}`,
                            },
                        ],
                    },
                    mode: 'right',
                    accessory: {
                        type: 'button',
                        theme: 'primary',
                        click: 'return-val',
                        value: `.教练房 排队 ${arena._id}`,
                        text: {
                            type: 'plain-text',
                            content: '报名',
                        },
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content: `当前呼叫：${calledString}`,
                    },
                },
            ],
        },
    ];
    return parseCard(card);
}
