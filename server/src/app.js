const path = require("path");
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const passport = require("passport");
const morgan = require('morgan');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const stageRoutes = require('./routes/stageRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const pollingRoutes = require('./routes/pollingRoutes');
const authenticate = require('./middleware/authenticate');

const UserModel = require('./models/User');

require("dotenv").config({ path: path.join(__dirname, './private/.env') });


/**
 *================================
 * Configure Redis Client
 *
 *================================
 */
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB,
});


/**
 *================================
 * Configure Express Session
 *
 *================================
 */
const oneDay = 1000 * 60 * 60 * 24;
const sessionConfig = {
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    //set false for testing
    secure: false,
    maxAge: oneDay
  }
}


/**
 *================================
 * Connect to MongoDB
 *
 *================================
 */
let mongoDB;
try {
  mongoose
    .connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  console.log('mongoDB connected OK');
  mongoDB = mongoose;
} catch {
  console.log('FAILED connecting mongoDB');
}

//this is for the integration tests
const getMongoDBInstance = () => mongoDB;



/**
 *================================
 * Connect Middlewares
 *
 *================================
 */
const app = express();
app.use(express.static(path.join(__dirname, './public/')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: [
      `https://localhost:${process.env.PORT || 4000}`,
    ],
    credentials: true,
  })
);
app.use(session(sessionConfig));


/**
 *================================
 * Initialize Passport 
 *  
 * 
 * Uses mongoose-local-passport \
 *  for easy integration with mongodb
 * 
 * Also uses googleOauth for authentication
 * using google
 *================================ 
 */
app.use(passport.initialize());
app.use(passport.session());
passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});


/**
 *================================
 * API ROUTES
 *
 *================================
 */
app.use("/auth", authRoutes);
app.use('/projects', authenticate, projectRoutes);
app.use('/stages', authenticate, stageRoutes);
app.use("/tasks", authenticate, taskRoutes);
app.use("/users", authenticate, userRoutes);
app.use("/poll", authenticate, pollingRoutes);
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});


//  Redis and getMongoDBInstance are exported so that Jest
//  can close their connections during testing
module.exports = {
  app,
  redisClient,
  getMongoDBInstance
}
