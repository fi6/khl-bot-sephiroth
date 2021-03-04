import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const ArenaSchema = createSchema({
    _id: Type.string({ required: true }),
    nickname: Type.string({ required: true, alias: 'userNick' }),
    code: Type.string({ required: true }),
    password: Type.string({ required: true }),
    arenaInfo: Type.string({ required: true }),
    remark: Type.string(),
    createdAt: Type.date({ required: true, default: new Date() }),
    member: Type.array({ required: true, default: [] }).of({
        _id: Type.string({ required: true }),
        nickname: Type.string({ required: true, alias: 'userNick' }),
    }),
});

export type ArenaDoc = ExtractDoc<typeof ArenaSchema>;

export default typedModel('Arena', ArenaSchema);
