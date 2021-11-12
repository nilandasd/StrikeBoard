const { Router } = require('express');
const usersController = require('../controllers/usersController');

const router = Router();

router.get('/users/:userid', usersController.getUser);
router.put('/users/:userid', usersController.updateUser);

module.exports = router;