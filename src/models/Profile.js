import mongoose from 'mongoose';

const regionSchema = new mongoose.Schema({
    _id: { // this is area code.
        type: String,
        required: true
    },
    province: String,
    city: String,
    area: String,
});

const ProfileSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    nickName: String, // khl nickname in author
    smashMain: [Number],
    network: [String],
    region: [regionSchema],
    alertUsedAt: { type: Date, default: 0 }
});

export default mongoose.model('Profile', ProfileSchema)