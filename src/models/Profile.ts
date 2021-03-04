import mongoose from 'mongoose';
import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const ProfileSchema = createSchema({
    _id: Type.string({ required: true, default: mongoose.Types.ObjectId() }),
    khl_id: Type.string({ required: true, alias: 'khlId', index: true }),
    nickname: Type.string(), // khl nickname in author
    smashMain: Type.array().of(Type.number()),
    network: Type.array().of(Type.string()),
    notif: Type.number(),
    region: Type.array().of(Type.number),
    alertUsedAt: Type.date({ default: new Date(0) }),
});

export type ProfileDoc = ExtractDoc<typeof ProfileSchema>;

export default typedModel('Profile', ProfileSchema);
