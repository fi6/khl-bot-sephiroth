import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const ArenaSchema = createSchema(
    {
        _id: Type.string({ required: true }),
        nickname: Type.string({ required: true, alias: 'userNick' }),
        // code: Type.string({ required: true }),
        // title: Type.string({ required: true }),
        // password: Type.string({ required: true }),
        // info: Type.string({ required: true }),
        // limit: Type.number({ required: true }),
        // remark: Type.string(),
        // createdAt: Type.date({ required: true }),
        expireAt: Type.date({ required: true }),
        // voice: Type.string({ required: true }),
        // invite: Type.string({ required: true }),
        // join: Type.boolean({ required: true, default: true }),
        _empty: Type.boolean({ required: true }),
        member: Type.array({ required: true, default: [] }).of({
            _id: Type.string({ required: true }),
            nickname: Type.string({ required: true, alias: 'userNick' }),
        }),
        ...({} as { expired: () => boolean; memberCount: () => number }),
    },
    { timestamps: { createdAt: false, updatedAt: true } }
);

ArenaSchema.methods.expired = function () {
    return (
        (this as unknown as typeof ArenaSchema.definition).expireAt < new Date()
    );
};
ArenaSchema.methods.memberCount = function () {
    return (this as unknown as typeof ArenaSchema.definition).member.length + 1;
};

type ArenaDoc = ExtractDoc<typeof ArenaSchema>;

export default typedModel('Arena', ArenaSchema);
