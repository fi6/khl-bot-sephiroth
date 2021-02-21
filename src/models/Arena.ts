import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const ArenaSchema = createSchema({
    _id: Type.string({ required: true }),
    userNick: Type.string({ required: true }),
    arenaId: Type.string({ required: true }),
    password: Type.string({ required: true }),
    arenaInfo: Type.string({ required: true }),
    remark: Type.string(),
    createdAt: Type.date({ required: true, default: new Date() }),
    member: Type.array({ required: true, default: [] }).of({
        _id: Type.string({ required: true }),
        userNick: Type.string({ required: true }),
    }),
});

export type ArenaDoc = ExtractDoc<typeof ArenaSchema>;

export default typedModel('Arena', ArenaSchema);
