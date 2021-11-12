const {Router} = require('express');
const authController = require('../controllers/authController');

const router = Router();

//local authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.login);

//google authentication
router.post('/googleAuth', authController.login);

module.exports = router;