const mongoose = require("mongoose");
const {Schema} = mongoose;

const User = mongoose.model(
  "User",
  new Schema({
      username: {
          type: String,
          required: true
      },
      password: {
          type: String,
          required: true
      },
      email: {
          type: String,
          required: true
      },
      photoUrl: {
          type: String,
          required: true
      },
  })
);

const Project = mongoose.model(
    "Project",
    new Schema({
        members: {
            type: [String],
            required: true
        },
        name: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            required: true
        },
        stages: {
            type: [String],
            required: true
        },
    })
);

const Task = mongoose.model(
    "Task",
    new Schema({
        name: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            required: true
        },
        Due: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        labels: {
            type: [String],
            required: true
        },
        Assigned: {
            type: [String],
            required: true
        }
    })
);

module.exports = {
    User,
    Project,
    Task
};
