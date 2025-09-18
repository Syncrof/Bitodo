const router = require('express').Router();
const { register, login, me, logout } = require('../controllers/auth.controller');
const requireAuth = require('../middlewares/requireAuth');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validations/auth.schema');

const rateLimit = require('../middlewares/rateLimit');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

module.exports = router;
