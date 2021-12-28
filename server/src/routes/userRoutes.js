const { Router } = require('express');
const {getUser, updateUser, getUsernames} = require('../controllers/userController');
const projectIsSelected = require('../middleware/projectIsSelected');
const router = Router();

router.get('/', getUser);
router.patch('/', updateUser);

//==============================================
//  REQUIRE PROJECT SELECTED!
//  all following routes must have selected project in session
router.use(projectIsSelected);
//==============================================

router.post('/project', getUsernames);

module.exports = router;
