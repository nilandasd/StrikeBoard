const { Router } = require('express');
const projectsController = require('../controllers/projectsController');

const router = Router();

router.get('/:id', projectsController.getProjects);
router.post('/', projectsController.newProject);
router.put('/:id', projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);

module.exports = router;
