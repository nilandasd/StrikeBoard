const { Router } = require('express');
const {validateIds} = require('../middleware/validateIds');
const {getProjects,
       newProject,
       renameProject,
       deleteProject,
       addStage,
       renameStage,
       deleteStage} = require('../controllers/projectController');
const router = Router();

router.get('/', validateIds, getProjects);
router.post('/', newProject);
router.patch('/:projectId', validateIds, renameProject);
router.delete('/:projectId', validateIds, deleteProject);

router.post('/:projectId/stages/:stage', validateIds, addStage);
router.patch('/:projectId/stages/:stage', validateIds, renameStage);
router.delete('/:projectId/stages/', validateIds, deleteStage);

module.exports = router;
