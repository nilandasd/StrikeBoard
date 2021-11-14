const passport = require('passport');
const {User} = require('../models/models');

const signUp = (req, res) => {
  if (!req.body.email) return res.status(400).json({message: "Email field required"});
  User.register(new User({
    username: req.body.username,
    email: req.body.email,
    photoUrl: ''
  }), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "ERROR" });
    }
    user.save((err, user) => {
      passport.authenticate('local')(req, res, () => {
        return res.status(200).json({ message: "Registration OK" })
      });
    });
  });
}

const login = (req, res) => {
  return res.status(200).json({ message: "login OK" })
}

const logout = (req, res) => {
  req.logout();
  return res.status(200).json({ message: "logged OK" })
}

const googleAuth = (req, res) => {
  //===================================NOT IMPLEMENTED ===================================
}

module.exports = {
  signUp,
  login,
  logout,
  googleAuth
};
