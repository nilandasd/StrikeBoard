const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = mongoose.model(
  "User",
  new Schema({
    username: String,
    password: String,
    email: String,
    photoURL: String
  })
);

const Project = mongoose.model(
  "Project",
  new Schema({
    name: String, 
    createdAt: String, 
    members: [String],
    stages: [String],
  })
);

const Task = mongoose.model(
  "Task",
  new Schema({
    name: String,
    createdAt: String,
    points: Number,
    description: String,
    assigned: String,
    stage: Number,
  })
);

module.exports = {
  User,
  Project,
  Task
};
