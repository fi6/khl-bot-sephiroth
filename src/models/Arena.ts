import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const ArenaSchema = createSchema({
    _id: Type.string({ required: true }),
    userNick: Type.string({ required: true }),
    arenaId: Type.string({ required: true }),
    password: Type.string({ required: true }),
    arenaInfo: Type.string({ required: true }),
    remark: Type.string(),
    isTraining: Type.boolean({ required: true, default: false }),
    createdAt: Type.date({ required: true, default: new Date() }),
    trainingLimit: Type.number({ required: true, default: 6 }),
    trainingQueue: Type.array({ required: true, default: [] }).of({
        _id: Type.string({ required: true }),
        userNick: Type.string({ required: true }),
        time: Type.date({ required: true, default: new Date() }),
        tag: Type.number({ required: true }),
    }),
});

export type ArenaDoc = ExtractDoc<typeof ArenaSchema>;

export default typedModel('Arena', ArenaSchema);
