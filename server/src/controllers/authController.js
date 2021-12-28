const User = require('../models/User');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');


const register = (req, res) => {
  if (
    !req.body.email ||
    !req.body.displayName ||
    !req.body.password) {
      return res.status(400).json(
        {message: "Missing required field(s)"});
  }

  bcrypt.hash(req.body.password, 11, (err, hash) => {
    if (err) return res.status(500).json({message: 'server error'});
    const newUser = new User({
      email: req.body.email,
      displayName: req.body.displayName,
      hash,
      photoUrl: '',
    });

    newUser.save((err, user) => {
      if (err) {
        if(err.code === 11000) {
          return res.sendStatus(409);
        } else {
          return res.sendStatus(500);
        }
      } else {
        const userInfo = { ...user._doc };
        req.session.user = userInfo;
        delete userInfo.hash;
        // delete userInfo.__v;
        // delete userInfo.createdAt;
        // delete userInfo.updatedAt;
        // delete userInfo._id;
        return res.status(200).json(userInfo);
      }
    });
  });
};

const login = (req, res) => {
  if (
    !req.body.email ||
    !req.body.password) {
    return res.status(400).json(
      { message: "Missing required field(s)" });
  }

  User.findOne({email: req.body.email}, (err, user) => {
    if (err) return res.status(500).json({message: 'server error'});
    if (!user) {
      return res.status(401).json({message: 'unauthorized'});
    } else {
      bcrypt.compare(req.body.password, user.hash).then(result => {
        if (result) {
          const userInfo = {...user._doc};
          req.session.user = user;
          delete userInfo.hash;
          // delete userInfo.__v;
          // delete userInfo.createdAt;
          // delete userInfo.updatedAt;
          // delete userInfo._id;
          return res.status(200).json(userInfo);
        } else {
          return res.status(401).json({message: 'unauthorized'});
        }
      });
    }
  });
}

const logout = (req, res) => {
  req.session.destroy();
  return res.sendStatus(200);
};

const session = (req, res) => {
  return res.status(200).json(req.session.user);
};

const createToken = async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  if (!user) return res.sendStatus(200);
  const token = await Token.findOne({userId: user._id});
  if (token) await Token.deleteOne({userId: user._id});
  let resetToken = crypto.randomBytes(32).toString("hex");
  bcrypt.hash(resetToken, 11, async (err, hash) => {
    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();
    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
    smtpTransport.sendEmail(user.email, "Password Reset Request", {name: user.displayName, link: link, }, "../templates/requestResetPassword.html");
    return res.sendStatus(200);
  });
}

const resetPassword = async (req, res) => {
  let passwordResetToken = await Token.findOne({email: req.body.email});
  if (!passwordResetToken) {
    return res.sendStatus(401);
  }
  const isValid = await bcrypt.compare(req.body.token, passwordResetToken.hash);
  if (!isValid) {
    return res.sendStatus(401);
  }
  bcrypt.hash(req.body.password, 11, async (err, hash) => {
    await User.updateOne(
      { _id: req.body.userId },
      { $set: { password: hash } },
      { new: true }
    );
    await Token.deleteOne({email :req.body.email});
    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.name,
      },
      "./template/resetPassword.handlebars"
    );

    return true;
  });
}

module.exports = {
  login,
  register,
  logout,
  session,
  createToken,
  resetPassword,
};
