import { model, Model, Schema } from 'mongoose';
import { default as mongoose } from 'mongoose';

export interface ArenaDoc {
    _id: string;
    nickname: string;
    code: string;
    title: string;
    password: string;
    info: string;
    limit: number;
    remark: string;
    createdAt: Date;
    expireAt: Date;
    voice: string;
    invite: string;
    join: boolean;
    _empty: boolean;
    member: {
        _id: string;
        nickname: string;
    }[];
    expired: boolean;
    memberCount: number;
}

const ArenaSchema = new Schema<ArenaDoc, Model<ArenaDoc>, ArenaDoc>({
    _id: { type: String, required: true },
    nickname: { type: String, required: true, alias: 'userNick' },
    code: { type: String, required: true },
    title: { type: String, required: true },
    password: { type: String, required: true },
    info: { type: String, required: true },
    limit: { type: Number, required: true },
    createdAt: { type: Date, required: true } as unknown as Date,
    expireAt: { type: Date, required: true } as unknown as Date,
    voice: { type: String, required: true },
    invite: { type: String, required: true },
    join: { type: Boolean, required: true, default: true },
    _empty: { type: Boolean, required: true },
    member: [
        {
            _id: { type: String, required: true },
            nickname: { type: String, required: true, alias: 'userNick' },
        },
    ],
});

ArenaSchema.virtual('expired').get(function () {
    return this.expireAt < new Date();
});

ArenaSchema.virtual('memberCount').get(function () {
    return this.member.length + 1;
});

export default model<ArenaDoc>('Arena', ArenaSchema);
