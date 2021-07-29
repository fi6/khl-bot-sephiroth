import { model } from 'mongoose';
import { Model } from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface DioEventMember {
    _id: string;
    nickname: string;
    reason: string;
    time: number;
    fighter: string;
    register: Date;
    number: number;
}

export interface DioEventDoc extends Document {
    title: string;
    code: string;
    members: DioEventMember[];
    lastNumber: number;
    addMember: (member: DioEventMember) => Promise<void>;
    removeMember: (member: DioEventMember) => boolean;
    sortQueue: () => void;
    /**
     * return -1 if member does not exist
     */
    memberExists: (id: string) => number;
}

const DioEventSchema =
    new Schema<DioEventDoc /*, Model<DioEventDoc>, DioEventDoc*/>({
        title: { type: String, required: true, unique: true },
        code: { type: String, required: true, unique: true },
        members: [
            {
                _id: String,
                nickname: String,
                reason: String,
                time: Number,
                fighter: String,
                register: Date,
                number: Number,
            },
        ],
    });

DioEventSchema.method('sortQueue', function () {
    this.members.sort((a, b) => {
        return a.number.valueOf() - b.number.valueOf();
    });
});

DioEventSchema.virtual('lastNumber').get(function (this: DioEventDoc) {
    this.sortQueue();
    return this.members.length
        ? this.members[this.members.length - 1].number
        : 0;
});

DioEventSchema.method('addMember', async function (member: DioEventMember) {
    const index = this.members
        .map((m) => {
            return m._id;
        })
        .indexOf(member._id);
    if (index !== -1) throw new Error('你已经报名过了');

    this.members.push(member);
    this.markModified('members');
    await this.save();
});

DioEventSchema.method('removeMember', async function (id: string) {
    const index = this.members
        .map((m) => {
            return m._id;
        })
        .indexOf(id);
    if (index === -1) throw new Error('你看起来还没有报名过……请先进行报名');

    this.members.splice(index, 1);
    this.markModified('members');
    this.save();
});

DioEventSchema.method('memberExists', function (id: string) {
    return this.members
        .map((m) => {
            return m._id;
        })
        .indexOf(id) > -1
        ? true
        : false;
});

export default model<DioEventDoc>('DioEvent', DioEventSchema);
