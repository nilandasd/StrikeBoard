const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
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
    required: true
  },
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

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
    pid: {
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
    stage: {
      type: Number,
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
  Task,
};
