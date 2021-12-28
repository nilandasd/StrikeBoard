const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserSchema = new Schema(
    {
        displayName: {
            type: String,
            required: true,
        },
        hash: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
            unique: true,
        },
        photoUrl: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('User', UserSchema);
