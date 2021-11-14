const { Router } = require('express');
const usersController = require('../controllers/userController');

const router = Router();

router.get('/users/:userId', getUser);
router.put('/users/:userId', updateUser);

module.exports = router;
