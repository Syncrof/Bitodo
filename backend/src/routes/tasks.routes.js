const { Router } = require('express');
const ctrl = require('../controllers/tasks.controller');
const { createStepSchema, updateStepSchema, updateNotesSchema } = require('../validations/tasks.schema');
const validate = require('../middlewares/validate');
const router = Router();

const requireAuth = require('../middlewares/requireAuth');
router.get('/',       requireAuth, ctrl.list);
router.put('/:id',    requireAuth, ctrl.replace);
router.get('/:id',    requireAuth, ctrl.getById);
router.post('/',      requireAuth, ctrl.create);
router.patch('/:id',  requireAuth, ctrl.update);
router.delete('/:id', requireAuth, ctrl.remove);

// Step CRUD
router.post('/:id/steps', validate(createStepSchema), ctrl.addStep);
router.patch('/:id/steps/:stepId', validate(updateStepSchema), ctrl.updateStep);
router.delete('/:id/steps/:stepId', ctrl.deleteStep);

// Notes güncelleme
router.patch('/:id/notes', validate(updateNotesSchema), ctrl.updateNotes);

module.exports = router;
