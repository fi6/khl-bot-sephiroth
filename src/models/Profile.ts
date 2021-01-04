import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const ProfileSchema = createSchema({
    _id: Type.string({ required: true }),
    userNick: Type.string({ required: true }), // khl nickname in author
    smashMain: Type.array({ required: true }).of(Type.number()),
    network: Type.array().of(Type.string()),
    region: Type.array().of(Type.number),
    alertUsedAt: Type.date({ default: new Date(0) }),
});

export type ProfileDoc = ExtractDoc<typeof ProfileSchema>;

export default typedModel("Arena", ProfileSchema);
