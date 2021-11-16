const {Router} = require('express');
const passport = require("passport");
const {privateRoute} = require('../middleware/privateRoute');
const {signUp, login, logout, googleAuth} = require('../controllers/authController');

const router = Router();

//local authentication
router.post('/signup', signUp);
router.post('/login', passport.authenticate('local'), login);
router.post('/logout', privateRoute, logout);

//google authentication
//router.post('/googleAuth', passport.authenticate('google'), googleAuth);

//router.get('/session', getSession);

//router.post('/resetPassword', resetPassword);
//router.post('/sendEmail', sendEmail);
module.exports = router;
