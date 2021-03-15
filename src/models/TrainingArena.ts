import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const TrainingArenaSchema = createSchema({
    _id: Type.string({ required: true }),
    nickname: Type.string({ required: true }),
    code: Type.string(),
    password: Type.string(),
    connection: Type.string({ required: true }),
    info: Type.string({ required: true }),
    register: Type.boolean({ default: true }),
    startAt: Type.date({ required: true }),
    createdAt: Type.date({ required: true, default: new Date() }),
    limit: Type.number({ required: true, default: 6 }),
    queue: Type.array({ required: true, default: [] }).of({
        _id: Type.string({ required: true }),
        nickname: Type.string({ required: true }),
        gameName: Type.string({ required: true }),
        time: Type.date({ required: true, default: new Date() }),
        number: Type.number({ required: true }),
        /**
         * -1: training finished / kicked, 0: in queue, 1: called, 2: checkin finished
         */
        state: Type.number({ default: 0 }),
    }),
});

export type TrainingArenaDoc = ExtractDoc<typeof TrainingArenaSchema>;

export default typedModel('TrainingArena', TrainingArenaSchema);
