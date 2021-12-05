const { Router } = require('express');
const projectIsSelected = require('../middleware/projectIsSelected');
const {
	getTasks,
	newTask,
	updateTask,
	deleteTask,
} = require('../controllers/taskController');

const router = Router();

//==============================================
//  REQUIRE PROJECT SELECTED!
//  all following routes must have selected project in session
router.use(projectIsSelected);
//==============================================

router.get('/', getTasks);
router.post('/', newTask);
router.patch('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

module.exports = router;
