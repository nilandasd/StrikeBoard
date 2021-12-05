const passport = require('passport');
const UserModel = require('../models/User');


const signUp = (req, res) => {
  if (!req.body.email || req.body.username || req.body.password) return res.status(400).json({message: "Missing required field(s)"});
  UserModel.register(new User({
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
  return res.status(200).json({uid: req.user._id});
}

const logout = (req, res) => {
  req.logout();
  req.session.destroy(err => {
    if(err){
      return res.status(500).json({message: "ERROR" });
    }else{
      return res.status(200).json({message: "logged OK" });
    }
  })
}

const googleAuth = (req, res) => {
  //===================================NOT IMPLEMENTED ===================================
}

const session = (req, res) => {
  if (req.session.project) {
    return res.status(200).json({ project: req.session.project });
  } else {
    return res.status(200).json({});
  }
}

module.exports = {
  signUp,
  login,
  logout,
  googleAuth,
  session,
};
