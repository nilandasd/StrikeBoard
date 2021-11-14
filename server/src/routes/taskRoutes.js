const { Router } = require('express');
const tasksController = require('../controllers/tasksController');

const router = Router();

router.get('/:projectId', getTasks);
router.post('/:projectId', newTask);
router.patch('/:projectId/:taskId' , updateTask);
router.delete('/:projectId/:taskId', deleteTask);


//update the description
//update the due date
//update who is assigned
//update the tags
module.exports = router;
