import mongoose from 'mongoose'
import auth from "configs/auth";


mongoose.connect(auth.mongourl, {
    user: auth.mongouser,
    pass: auth.mongopass,
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, function (err) {
    if (err) {
        console.log('Some problem with the connection ' + err);
    } else {
        console.log('The Mongoose connection is ready');
    }
});


const db = mongoose.connection;

db.once('open', function () {
    console.log('db connected');  // we're connected!
});

export default db