const { Router } = require('express');
const {getUser, updateUser} = require('../controllers/userController');

const router = Router();

router.get('/users', getProjectUsernames);
router.get('/users/:userId', getUser);
router.put('/users/:userId', updateUser);

module.exports = router;
