import { Document, model, Model, Schema } from 'mongoose';

export interface ggUser {
    slug: string;
    playerId: string;
    userId: string;
    prefix?: string;
    name?: string;
    onSetId?: string;
    temp: boolean;
}

export interface ProfileDoc extends Document {
    id: string; // this is actually khl id
    _id: string;
    nickname: string;
    ggUser: ggUser;
}

const ProfileSchema =
    new Schema<ProfileDoc /*, Model<ProfileDoc>, ProfileDoc*/>({
        _id: { type: String, required: true },
        nickname: { type: String, required: true },
        ggUser: {
            slug: { type: String, required: true },
            playerId: { type: String, required: true },
            userId: { type: String, required: true },
            prefix: String,
            name: String,
            onSetId: String,
            temp: { type: String, required: true },
        },
    });

export default model<ProfileDoc>('Profile', ProfileSchema);
