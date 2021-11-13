const { Router } = require('express');
const tasksController = require('../controllers/tasksController');

const router = Router();

router.get('/:projectId', tasksController.getTasks);
router.post('/:projectId', tasksController.newTask);
router.get('/:projectId/:taskId', tasksController.getTask);
router.put('/:projectId/:taskId', tasksController.updateTask);
router.delete('/:projectId/:taskId', tasksController.deleteTask);

module.exports = router;
