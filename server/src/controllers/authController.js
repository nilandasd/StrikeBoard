const passport = require('passport');
const {User} = require('../models/models');

const signUp = (req, res) => {
    if (!req.body.email) return res.status(400).json({ message: "BAD request" });
    User.register(new User({
        username: req.body.username,
        email: req.body.email,
        photoUrl: ''
    }), req.body.password, (err, user) => {

        if (err) {
            return res.status(400).json({ message: "BAD request" });
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

}

module.exports = {
    signUp,
    login,
    logout,
    googleAuth
};
