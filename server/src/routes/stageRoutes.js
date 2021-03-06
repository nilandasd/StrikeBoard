const { Router } = require('express');
const projectIsSelected = require('../middleware/projectIsSelected');
const {
  addStage,     
  renameStage,     
  deleteStage,     
  moveTasks,     
  deleteTasks,
} = require('../controllers/stageController');
const router = Router();

//==============================================
//  REQUIRE PROJECT SELECTED!
//  all following routes must have selected project in session
router.use(projectIsSelected);
//==============================================

router.post('/', addStage);
router.put('/:stageIndex', renameStage);
router.delete('/:stageIndex', deleteStage);
router.put('/tasks/:stageIndex', moveTasks)
// router.get('/tasks/:stageIndex', getTasks);
router.delete('/tasks/:stageIndex', deleteTasks)

module.exports = router;
