const { Router } = require('express');
const {getProjects, newProject, updateProject, deleteProject} = require('../controllers/projectController');
const router = Router();

router.get('/:id', getProjects);
router.post('/', newProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
