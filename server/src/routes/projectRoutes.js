const { Router } = require('express');
const {validateIds} = require('../middleware/validateIds');
const {projectIsSelected} = require('../middleware/projectIsSelected');
const {getProjects,
       newProject,
       renameProject,
       deleteProject,
       addStage,
       selectProject,
       renameStage,
       deleteStage} = require('../controllers/projectController');
const router = Router();

//adding a project ID in the query param selects
//a specific project and adds the project to your session
router.get('/', validateIds, getProjects);
router.post('/', newProject);

//==============================================
//  REQUIRE PROJECT SELECTED!
//  all following routes must have selected project in session
router.use(projectIsSelected);
//==============================================

router.patch('/', renameProject);
router.delete('/', deleteProject);

module.exports = router;
