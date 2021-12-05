const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema(
    {
        members: {
            type: [String],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        stages: {
            type: [String],
            required: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);
