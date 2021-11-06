const express = require("express");
const router = express.Router();
const generateToken = require("../util//generateToken");
const { User } = require("../models/models");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  if(req.body.username === "" || req.body.username === null) {
    return res.sendStatus(401);
  }
  try {
    const user = await User.findOne({ username: req.body.username}).exec();
    if (user === null) {
      const hash = await bcrypt.hash(req.body.password, 13);
      const newUser = new User({
        username: req.body.username,
        password: hash,
      });
      await newUser.save();
      await generateToken(res, req.body.username, "null");
      res.status(201).json({ message: "Account created, and logged in!" });
    } else {
      res.status(401).json({ message: "That username is taken" });
    }
  } catch (err) {
    return res.status(500).json(err.toString());
  }
});

router.post("/login", async (req, res) => {
  try {
    // get user details based on the login parameters
    const result = await User.findOne({
      username: req.body.username,
    }).exec();
    if (result !== null && bcrypt.compareSync(req.body.password, result.password)) {
      await generateToken(res, req.body.username, "null");
      res.status(201).json({ message: "logged in" });;
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  } catch (err) {
    return res.status(500).json(err.toString());
  }
});

module.exports = router;