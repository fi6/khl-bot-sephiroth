import { Model, model, Schema } from 'mongoose';
import { formatTime } from '../utils/format-time';
import Arena, { ArenaDoc } from './Arena';

export interface QueueMember {
    _id: string;
    nickname: string;
    number: number;
    /**
     * -1: training finished / kicked, 0: in queue, 1: called, 2: checkin finished
     */
    state: number;
    time?: Date;
}

export interface TrainingArenaDoc extends ArenaDoc {
    schedule?: Date;
    start: boolean;
    avatar: string;
    endNumber: number;
    remark: string;
    queue: QueueMember[];
    full: boolean;
    joinValidation: (khlId: string) => void;
    lastNumber: number;
    currentNumber: number;
    sortQueue: () => void;
    nextCallableUser: QueueMember | undefined;
}

const TrainingArenaSchema = new Schema<TrainingArenaDoc /*,
    Model<TrainingArenaDoc>,
    TrainingArenaDoc*/>({
    start: { type: Boolean, required: true, default: false },
    endNumber: Number,
    avatar: String,
    remark: String,
    schedule: { type: Date },
    queue: [
        {
            _id: { type: String, required: true },
            nickname: { type: String, required: true },
            number: { type: Number, required: true },
            state: { type: Number, required: true },
            time: { type: Date },
        },
    ],
});

TrainingArenaSchema.virtual('lastNumber').get(function (
    this: TrainingArenaDoc
) {
    this.sortQueue();
    return this.queue.length ? this.queue[this.queue.length - 1].number : 0;
});

TrainingArenaSchema.virtual('full').get(function (this: TrainingArenaDoc) {
    const member = this.queue.filter((m) => [1, 2].includes(m.state));
    if (member.length >= this.limit - 1) return true;
    return false;
});

TrainingArenaSchema.virtual('currentNumber').get(function (
    this: TrainingArenaDoc
) {
    this.sortQueue();
    return this.queue.find((m) => m.state == 1)?.number ?? this.lastNumber;
});

TrainingArenaSchema.virtual('nextCallableUser').get(function (
    this: TrainingArenaDoc
) {
    this.sortQueue();
    for (const user of this.queue) {
        if (user.state == 0) {
            return user;
        }
    }
});

TrainingArenaSchema.method('sortQueue', function () {
    this.queue.sort((a, b) => {
        return a.number.valueOf() - b.number.valueOf();
    });
});

TrainingArenaSchema.method(
    'toInfoModule',
    function (khlId?: string, showPassword = false) {
        // const playerInArena =
        //     (khlId && this.checkMember(khlId)) || showPassword;
        const player = this.queue.find((m) => m._id === khlId);

        const codePass = `${this.code} ${
            (player && player.state == 2) || showPassword
                ? this.password
                : `\*\*\*`
        }`;

        return [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: `${this.nickname} 的教练房`,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: '留言: ' + this.remark,
                },
                mode: 'left',
                accessory: {
                    type: 'image',
                    src: this.avatar,
                    size: 'sm',
                    circle: true,
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
                                    : `将于${formatTime(
                                          this.schedule ?? new Date()
                                      )}开放`
                            }`,
                        },
                        {
                            type: 'kmarkdown',
                            content: `**房间信息**\n${this.info ?? ''}`,
                        },
                        {
                            type: 'kmarkdown',
                            content: `**当前/你的号码**\n${
                                this.currentNumber
                            }/${player?.number ?? '未排队'}`,
                        },
                    ],
                },
                mode: 'right',
                accessory: {
                    type: 'button',
                    theme: !player
                        ? 'primary'
                        : [0, 1, 2].includes(player.state)
                        ? 'danger'
                        : 'secondary',
                    value: `.教练房 ${!player ? '排队' : '退出'} ${this.id}`,
                    click: 'return-val',
                    text: {
                        type: 'plain-text',
                        content: !player
                            ? '加入排队'
                            : [0, 1].includes(player.state)
                            ? '退出排队'
                            : player.state == 2
                            ? '离开房间'
                            : '已完成',
                    },
                },
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
            } else if ([1, 2].includes(user.state)) {
                throw new Error('你正在被呼叫或已完成签到，请不要重复加入队伍');
            } else throw new Error('你已经在队伍中了');
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
