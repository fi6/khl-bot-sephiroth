import mongoose from 'mongoose';

const ArenaSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    userNick: String,
    arenaId: String,
    password: String,
    arenaInfo: String,
    remark: String,
    alertedAt: Date,
    isTraining: Boolean,
    trainingLimit: Number,
    trainingQueue: [new mongoose.Schema({
        _id: String,
        userNick: String,
        time: Date,
        tag: Number
    })],
    createdAt: Date,
});

export default mongoose.model('Arena', ArenaSchema);