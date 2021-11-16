const { Router } = require('express');
const {validateIds} = require('../middleware/validateIds');
const {projectIsSelected} = require('../middleware/projectIsSelected');
const {
	getTasks,
	newTask,
	updateAllTasks,
	updateTask,
	deleteTask,
} = require('../controllers/taskController');

const router = Router();

//==============================================
//  REQUIRE PROJECT SELECTED!
//  all following routes must have selected project in session
router.use(projectIsSelected);
//==============================================

router.get('/', validateIds, getTasks);
router.post('/', newTask);
router.patch('/:taskId', validateIds, updateTask);
router.delete('/:taskId', validateIds, deleteTask);

module.exports = router;
