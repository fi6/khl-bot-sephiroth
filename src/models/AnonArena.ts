import Arena, { ArenaDoc } from './Arena';
import { Document, Model, model, Schema } from 'mongoose';

export interface AnonArena extends ArenaDoc {
    nickname: '';
    info: '';
    voice: '';
    limit: 0;
    join: false;
    full: true;
    public: true;
    _empty: false;
}

const AnonArenaSchema = new Schema<ArenaDoc /*, Model<ArenaDoc>, ArenaDoc*/>(
    {}
);

AnonArenaSchema.method('toInfoString', function () {
    return `${this.code} ${this.password} ${this.title}`;
});

AnonArenaSchema.method('toInfoModule', function () {
    return [
        {
            type: 'section',
            text: {
                type: 'kmarkdown',
                content: '匿名房间',
            },
        },
        {
            type: 'section',
            text: {
                type: 'kmarkdown',
                content: this.toInfoString(),
            },
        },
    ];
});

export default Arena.discriminator('AnonArena', AnonArenaSchema);
