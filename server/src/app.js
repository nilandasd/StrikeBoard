const path = require("path");
const express = require("express");
const cors = require("cors");
const server = require("https");
const session = require('express-session');
const passport = require("passport");
const fs = require("fs");
const morgan = require('morgan')
const mongoose = require("mongoose");
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const {User} = require('./models/models');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const stageRoutes = require('./routes/stageRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const {privateRoute} = require('./middleware/privateRoute');

const oneDay = 1000 * 60 * 60 * 24;

require("dotenv").config({ path: path.join(__dirname, './private/.env') });


/**
 *================================
 * Connect to MongoDB
 *
 *================================
 */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `DB connected`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });


/**
 *================================
 * Connect to Redis
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
app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {secure: true,
           maxAge: oneDay}
}));


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
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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
app.use('/projects', privateRoute, projectRoutes);
app.use('/stages', privateRoute, stageRoutes);
app.use("/tasks", privateRoute, taskRoutes);
app.use("/user", privateRoute, userRoutes);

//serves a React SPA
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.use("/", (req, res) => {
  res.status(404).json({message: 'Route does not exist'})
});


/**
 *================================
 * CREATE SERVER
 * 
 * self signed!!!
 *================================
 */
const PORT = process.env.PORT || 4000;
server.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, '/private/key.pem'), 'utf8'),
    cert: fs.readFileSync(path.join(__dirname, './private/server.crt'), 'utf8')
  },
  app
).listen(PORT, () => console.log(`Serving on port: ${PORT}`));
