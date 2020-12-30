import mongoose from 'mongoose'
import auth from "../configs/auth.js";

mongoose.connect(auth.mongourl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.log('Some problem with the connection ' + err);
    } else {
        console.log('The Mongoose connection is ready');
    }
});
mongoose.set('useFindAndModify', false);

const db = mongoose.connection

db.once('open', function () {
    console.log('db connected')// we're connected!
});

export default db