const { Router } = require('express');
const projectIsSelected = require('../middleware/projectIsSelected');
const {getProjects,
       newProject,
       renameProject,
       deleteProject,
       addMember} = require('../controllers/projectController');
const router = Router();

//adding a project ID in the query param selects the project
router.get('/', getProjects);
router.post('/', newProject);

//==============================================
//  REQUIRE PROJECT SELECTED!
//  all following routes must have selected project in session
router.use(projectIsSelected);
//==============================================

router.patch('/', renameProject);
router.post('/members', addMember);
router.delete('/', deleteProject);

module.exports = router;
