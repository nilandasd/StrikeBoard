const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        hash: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        photoUrl: {
            type: String,
            required: false
        }
    },
    
    {
        timestamps: true
    }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
