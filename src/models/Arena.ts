import mongoose, { Document, Schema } from 'mongoose';

export interface IArena extends Document {
    _id: string;
    userNick?: string;
    arenaId?: string;
    password: string;
    arenaInfo: string;
    remark: string;
    trainingLimit: number;
    trainingQueue: mongoose.Types.Array<any>;
    createdAt: Date
}

const ArenaSchema: Schema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    userNick: String,
    arenaId: String,
    password: String,
    arenaInfo: String,
    remark: String,
    isTraining: Boolean,
    trainingLimit: Number,
    trainingQueue: [{
        _id: String,
        userNick: String,
        time: Date,
        tag: Number
    }],
    createdAt: Date,
});

export default mongoose.model<IArena>('Arena', ArenaSchema);