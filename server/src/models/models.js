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
    required: false
  }
},
  {
  timestamps: true
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
  })
);

const Task = mongoose.model(
  "Task",
  new Schema({
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
  })
);

const Token = mongoose.model(
  "Token",
  new Schema({
    uid: {
      type: String,
      required: true
    },
    createdAt: { type: Date, expires: '3m', default: Date.now }
  }
);

module.exports = {
  User,
  Project,
  Task,
  Token
};
