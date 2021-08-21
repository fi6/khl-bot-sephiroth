import { Document, model, Model, Schema } from 'mongoose';

export interface ggUserDoc {
    slug: string;
    playerId: string;
    userId: string;
    prefix?: string;
    name?: string;
    onSetId?: string;
    temp: boolean;
}

const ggUserSchema = new Schema<ggUserDoc, Model<ggUserDoc>, ggUserDoc>({
    slug: { type: String, required: true },
    playerId: { type: String, required: true },
    userId: { type: String, required: true },
    prefix: String,
    name: String,
    onSetId: String,
    temp: Boolean,
});

export interface ProfileDoc extends Document {
    id: string; // this is actually khl id
    _id: string;
    nickname: string;
    ggUser?: ggUserDoc;
}

const ProfileSchema = new Schema<ProfileDoc, Model<ProfileDoc>, ProfileDoc>({
    _id: { type: String, required: true },
    nickname: { type: String, required: true },
    ggUser: ggUserSchema,
});

export default model<ProfileDoc>('Profile', ProfileSchema);
