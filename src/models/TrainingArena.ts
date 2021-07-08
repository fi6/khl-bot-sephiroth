import { Model, model, Schema } from 'mongoose';
import { formatTime } from '../utils/format-time';
import Arena, { ArenaDoc } from './Arena';

export interface TrainingArenaDoc extends ArenaDoc {
    schedule: Date;
    start: boolean;
    register: boolean;
    avatar: string;
    queue: {
        _id: string;
        nickname: string;
        gameName: string;
        number: number;
        /**
         * -1: training finished / kicked, 0: in queue, 1: called, 2: checkin finished
         */
        state: number;
        time: Date;
    }[];
    joinValidation: (khlId: string) => void;
    nextNumber: number;
    sortQueue: () => void;
}

const TrainingArenaSchema = new Schema<
    TrainingArenaDoc,
    Model<TrainingArenaDoc>,
    TrainingArenaDoc
>({
    start: { type: Boolean, required: true, default: false },
    schedule: { type: Date, required: true },
    queue: [
        {
            _id: { type: String, required: true },
            nickname: { type: String, required: true },
            gameName: { type: String, required: true },
            number: { type: Number, required: true },
            state: { type: Number, required: true },
            time: { type: Date, required: true },
        },
    ],
});

TrainingArenaSchema.virtual('nextNumber').get(function (
    this: TrainingArenaDoc
) {
    this.sortQueue();
    return this.queue.length ? this.queue[this.queue.length - 1].number + 1 : 1;
});

TrainingArenaSchema.method('sortQueue', function () {
    this.queue.sort((a, b) => {
        return a.time.valueOf() - b.time.valueOf();
    });
});

TrainingArenaSchema.method(
    'toInfoModule',
    function (khlId: string, showPassword = false) {
        const memberString =
            this.memberString ?? '房间中还没有人。快来加入吧！';
        const buttonJoin = {
            type: 'button',
            theme: this.join ? 'primary' : 'secondary',
            value: `.房间 加入 ${this.id}`,
            click: this.join ? 'return-val' : '',
            text: {
                type: 'plain-text',
                content: this.join ? '加入' : '暂停加入',
            },
        };
        const buttonLeave = {
            type: 'button',
            theme: 'danger',
            value: `.房间 退出 ${this.id}`,
            click: 'return-val',
            text: {
                type: 'plain-text',
                content: '退出',
            },
        };

        const playerInArena =
            (khlId && this.checkMember(khlId)) || showPassword;

        const codePass = `${this.code} ${
            playerInArena ? this.password : `\*\*\*`
        }`;

        return [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: this.title.includes(this.nickname)
                        ? this.title
                        : `${this.title} (By ${this.nickname})`,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'paragraph',
                    cols: 3,
                    fields: [
                        {
                            type: 'kmarkdown',
                            content: `**房间号/密码**\n${
                                this.start
                                    ? codePass
                                    : `将于${formatTime(this.schedule)}开放`
                            }`,
                        },
                        {
                            type: 'kmarkdown',
                            content: `**房间信息**\n${this.info ?? ''}`,
                        },
                        {
                            type: 'kmarkdown',
                            content: `**有效至**\n${formatTime(this.expireAt)}`,
                        },
                    ],
                },
                mode: 'right',
                accessory: playerInArena ? buttonJoin : buttonLeave,
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'plain-text',
                        content: memberString,
                    },
                ],
            },
        ];
    }
);

TrainingArenaSchema.method('joinValidation', function (khlId: string) {
    for (const user of this.queue) {
        if (user._id == khlId) {
            if (user.state == -1) {
                throw new Error(
                    '你未能按时签到，或已完成特训。请等待下次的教练房。'
                );
            } else if (user.state in [1, 2]) {
                throw new Error('你正在被呼叫或已完成签到，请不要重复加入队伍');
            }
        }
    }
});

export default Arena.discriminator('TrainingArena', TrainingArenaSchema);

// const TrainingArenaSchema = createSchema({
//     _id: Type.string({ required: true }),
//     avatar: Type.string({ required: true }),
//     nickname: Type.string({ required: true }),
//     code: Type.string(),
//     card: Type.string(),
//     password: Type.string(),
//     connection: Type.string({ required: true }),
//     info: Type.string({ required: true }),
//     register: Type.boolean({ default: true }),
//     startAt: Type.date({ required: true }),
//     createdAt: Type.date({ required: true, default: new Date() }),
//     limit: Type.number({ required: true, default: 6 }),
//     queue: Type.array({ required: true, default: [] }).of({
//         _id: Type.string({ required: true }),
//         nickname: Type.string({ required: true }),
//         gameName: Type.string({ required: true }),
//         time: Type.date({ required: true, default: new Date() }),
//         number: Type.number({ required: true }),

//         state: Type.number({ default: 0 }),
//     }),
// });

// export type TrainingArenaDoc = ExtractDoc<typeof TrainingArenaSchema>;

// export default typedModel('TrainingArena', TrainingArenaSchema);
