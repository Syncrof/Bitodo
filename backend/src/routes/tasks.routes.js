const { Router } = require('express');
const ctrl = require('../controllers/tasks.controller');
const router = Router();

router.get('/',       ctrl.list);
router.put('/:id',    ctrl.replace);
router.get('/:id',    ctrl.getById);
router.post('/',      ctrl.create);
router.patch('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
