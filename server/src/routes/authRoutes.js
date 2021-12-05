const {Router} = require('express');
const passport = require("passport");
const authenticate = require('../middleware/authenticate');
const {signUp, login, logout, session} = require('../controllers/authController');

const router = Router();

//local authentication
router.post('/signup', signUp);
router.post('/login', passport.authenticate('local'), login);
router.post('/logout', authenticate, logout);
router.get('/session', authenticate, session);

module.exports = router;
