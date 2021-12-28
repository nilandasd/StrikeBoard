const {Router} = require('express');
const authenticate = require('../middleware/authenticate');
const {register, login, logout, session, createToken, resetPassword} = require('../controllers/authController');
const router = Router();

router.post('/login', login);
router.post('/register', register)
router.post('/logout', authenticate, logout);
router.post('/token', createToken);
router.post('/reset', resetPassword);
router.get('/session', authenticate, session);

module.exports = router;
