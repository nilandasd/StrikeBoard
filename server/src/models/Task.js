const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        pid: {
            type: String,
            required: true
        },
        stage: {
            type: Number,
            required: true
        },
        Due: {
            type: Date,
            required: false,
            default: null
        },
        description: {
            type: String,
            required: false,
            default: ''
        },
        labels: {
            type: [String],
            required: false,
            default: []
        },
        Assigned: {
            type: [String],
            required: false,
            default: []
        }
    },
        {
            timestamps: true
        }
);

module.exports = mongoose.model("Task", taskSchema);
