import mongoose from 'mongoose'
import auth from "../configs/auth.js";

async function dbtest() {
    mongoose.connect('mongodb://127.0.0.1:27017/pts', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err) {
            console.log('Some problem with the connection ' + err);
        } else {
            console.log('The Mongoose connection is ready');
        }
    });
    mongoose.set('useFindAndModify', false);


    const AuthorSchema = new mongoose.Schema(
        {
            first_name: { type: String, required: true, max: 100 },
            family_name: { type: String, required: true, max: 100 },
            date_of_birth: { type: Date },
            date_of_death: { type: Date },
        }
    );

    let Author = mongoose.model('Author', AuthorSchema);

    Author.create({
        first_name: '1',
        family_name: '2'
    });

    Author.findOne({
        first_name: '1'
    });

}

export default dbtest