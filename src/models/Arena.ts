import { Document, model, Model, Schema } from 'mongoose';
import { formatTime } from '../utils/format-time';

export interface ArenaDoc extends Document {
    __t: any;
    id: string;
    _id: string;
    nickname: string;
    code: string;
    title: string;
    password: string;
    info: string;
    limit: number;
    createdAt: Date;
    expireAt: Date;
    voice: string;
    invite: string;
    join: boolean;
    full: boolean;
    public: boolean;
    _empty: boolean;
    _closed: boolean;
    allowBroadcast: Date;
    member: {
        _id: string;
        nickname: string;
    }[];
    header: string;
    updatedAt: Date;
    expired: boolean;
    memberCount: number;
    memberString: string | undefined;
    checkMember: (khlId: string) => boolean | undefined;
    toInfoModule: (
        khlId?: string,
        infoOnly?: boolean,
        showPassword?: boolean
    ) => unknown[];
    toInfoString: () => string;
}

const ArenaSchema = new Schema<ArenaDoc /*, Model<ArenaDoc>, ArenaDoc*/>(
    {
        _id: { type: String, required: true, alias: 'id' },
        nickname: { type: String, required: true, alias: 'userNick' },
        code: { type: String, required: true },
        title: { type: String, required: true },
        password: { type: String, required: true },
        info: { type: String, required: true },
        limit: { type: Number, required: true },
        createdAt: { type: Date, required: true },
        expireAt: { type: Date, required: true },
        public: { type: Boolean, required: true, default: false },
        voice: { type: String, required: true },
        invite: { type: String, required: true },
        join: { type: Boolean, required: true, default: true },
        _empty: { type: Boolean, required: true },
        _closed: { type: Boolean, required: true },
        allowBroadcast: { type: Date, required: true, default: Date.now },
        member: [
            {
                _id: { type: String, required: true },
                nickname: { type: String, required: true, alias: 'userNick' },
            },
        ],
    },
    { timestamps: { updatedAt: true } }
);

ArenaSchema.virtual('expired').get(function (this: ArenaDoc) {
    return this.expireAt < new Date();
});

ArenaSchema.virtual('memberCount').get(function (this: ArenaDoc) {
    return this.member.length + 1;
});

ArenaSchema.virtual('full').get(function (this: ArenaDoc) {
    return this.member.length >= this.limit - 1;
});

ArenaSchema.virtual('memberString').get(function (this: ArenaDoc) {
    if (!this.member?.length) return;
    const nickList = this.member.map((member: { nickname: string }) => {
        return member.nickname;
    });
    return (
        `(${this.memberCount}/${this.limit}) ` +
        nickList.join(', ') +
        ` 在房间中`
    );
});

ArenaSchema.virtual('header').get(function (this: ArenaDoc) {
    return (
        (this.public ? '公开: ' : '') +
        (this.title.includes(this.nickname)
            ? this.title
            : `${this.title} (By ${this.nickname})`)
    );
});

ArenaSchema.method('checkMember', function (khlId: string) {
    if (!this.member?.length) {
        return false;
    }
    const validation = this.member.map((user) => {
        // console.debug(user._id, khlId);
        if (user._id === khlId) {
            return true;
        }
    });
    if (validation.includes(true)) return true;
    return false;
});

ArenaSchema.method('toInfoString', function () {
    return `${
        this.header
    }\n${this.code} ${this.public ? this.password : '***'} 人数：${this.memberCount}/${this.limit}`;
});

ArenaSchema.method(
    'toInfoModule',
    function (khlId?: string, infoOnly = false, showPassword?: boolean) {
        const memberString =
            this.memberString ?? '房间中还没有人。快来加入吧！';
        const buttonJoin = {
            type: 'button',
            theme: this.join && !this.full ? 'primary' : 'secondary',
            value: `.房间 加入 ${this.id}`,
            click: this.join && !this.full ? 'return-val' : '',
            text: {
                type: 'plain-text',
                content: this.join && !this.full ? '加入' : '暂停加入',
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
        let arenaContent;
        if (khlId === this._id) infoOnly = true;
        if (showPassword === undefined) showPassword = this.public;
        if ((khlId && this.checkMember(khlId)) || showPassword) {
            arenaContent = `**房间号/密码**\n${this.code} ${this.password}`;
        } else {
            arenaContent = `**房间号/密码**\n${this.code} \*\*\*`;
        }
        return [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: this.header,
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
                            content: arenaContent,
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
                accessory: infoOnly
                    ? {}
                    : khlId && this.checkMember(khlId)
                    ? buttonLeave
                    : buttonJoin,
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

export default model<ArenaDoc>('Arena', ArenaSchema);
