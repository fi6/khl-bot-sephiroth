import mongoose, { Document } from 'mongoose';

interface IProfile extends Document{
    _id: string;
    nickName: String;
    smashMain?: mongoose.Types.Array<number>;
    network?: mongoose.Types.Array<string>;
    region: mongoose.Types.Array<string>;
    alertUsedAt: Date;
}


const ProfileSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    nickName: String, // khl nickname in author
    smashMain: [Number],
    network: [String],
    region: [String],
    alertUsedAt: { type: Date, default: 0 }
});

export default mongoose.model<IProfile>('Profile', ProfileSchema)