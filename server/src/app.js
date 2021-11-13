const path = require("path");
const express = require("express");
const cors = require("cors");
const server = require("https");
const session = require('express-session');
const passport = require("passport");
const fs = require("fs");
const morgan = require('morgan')
const mongoose = require("mongoose");
const { User } = require('./models/models');
const authRoutes = require('./routes/AuthRoutes');
const projectRoutes = require('./routes/ProjectRoutes');
// const taskRoutes = require('./routes/AuthRoutes');
// const userRoutes = require('./routes/AuthRoutes');
const { loggedIn } = require('./middleware/loggedIn');

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
 * Middlewares
 *
 *================================
 */
const app = express();
app.use(express.static("/public"));
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
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));



/**
 *================================
 * Passport local strategy 
 *  
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
 * ROUTES
 *
 *================================
 */
app.use("/auth", authRoutes);
app.use("/projects", loggedIn, projectRoutes);
// app.use("/tasks", loggedIn, taskRoutes);
// app.use("/user", loggedIn, userRoutes);
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});


/**
 *================================
 * CREATE SERVER
 *
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
