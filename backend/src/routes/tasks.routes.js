const { Router } = require('express');
const ctrl = require('../controllers/tasks.controller');
const { createStepSchema, updateStepSchema, updateNotesSchema } = require('../validations/tasks.schema');
const validate = require('../middlewares/validate');
const router = Router();

router.get('/',       ctrl.list);
router.put('/:id',    ctrl.replace);
router.get('/:id',    ctrl.getById);
router.post('/',      require('../middlewares/requireAuth'), ctrl.create);
router.patch('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);

// Step CRUD
router.post('/:id/steps', validate(createStepSchema), ctrl.addStep);
router.patch('/:id/steps/:stepId', validate(updateStepSchema), ctrl.updateStep);
router.delete('/:id/steps/:stepId', ctrl.deleteStep);

// Notes güncelleme
router.patch('/:id/notes', validate(updateNotesSchema), ctrl.updateNotes);

module.exports = router;
