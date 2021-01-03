import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const ArenaSchema = createSchema({
    _id: Type.string({ required: true }),
    userNick: Type.string({ required: true }),
    arenaId: Type.string({ required: true }),
    password: Type.string({ required: true }),
    arenaInfo: Type.string({ required: true }),
    remark: Type.string(),
    isTraining: Type.boolean(),
    createdAt: Type.date({ required: true }),
    trainingLimit: Type.number(),
    trainingQueue: Type.array().of({
        _id: Type.string({ required: true }),
        userNick: Type.string({ required: true }),
        time: Type.date({ required: true }),
        tag: Type.number(),
    }),
});

export type ArenaDoc = ExtractDoc<typeof ArenaSchema>;

export default typedModel('Arena', ArenaSchema);
