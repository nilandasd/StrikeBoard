const {Router} = require('express');
const passport = require("passport");
const {loggedIn} = require('../middleware/loggedIn');
const {signUp, login, logout, googleAuth} = require('../controllers/authController');

const router = Router();

//local authentication
router.post('/signup', signUp);
router.post('/login', passport.authenticate('local'), login);
router.post('/logout', loggedIn, logout);

//google authentication
//router.post('/googleAuth', passport.authenticate('google'), googleAuth);

module.exports = router;
