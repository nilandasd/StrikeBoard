const { Router } = require('express');
const {validateIds} = require('../middleware/validateIds');
const {projectIsSelected} = require('../middleware/projectIsSelected');
const {addStage,
       renameStage,
       deleteStage,
       deleteProject,
       moveTasks,
       deleteTasks} = require('../controllers/projectController');
const router = Router();

//==============================================
//  REQUIRE PROJECT SELECTED!
//  all following routes must have selected project in session
router.use(projectIsSelected);
//==============================================

router.post('/', addStage);
router.patch('/:stageIndex', renameStage);
router.delete('/:stageIndex', deleteStage);
router.patch('/tasks/:stageIndex', moveTasks)
router.get('/tasks/:stageIndex', getTasks);
router.delete('/tasks/:stageIndex', deleteTasks)

module.exports = router;
