import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    nickName: String, // khl nickname in author
    ggSlug: String,
    ggPlayerId: String,
    gamerTag: String,
    prefix: String,
    alertUsedAt: { type: Date, default: 0 }

});

export default mongoose.model('Profile', ProfileSchema)