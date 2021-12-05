const mongoose = require("mongoose");
const { Schema } = mongoose;

// used for reseting passwords via email
const tokenSchema = new Schema(
    {
        uid: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            expires: '3m',
            default: Date.now
        }
    }
);

module.exports = mongoose.model("Token", tokenSchema);
