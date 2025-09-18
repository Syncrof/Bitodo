const { PORT } = require('./lib/config');
const app = require('./App');
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/tasks', require('./routes/tasks.routes'));
app.use(require('./middlewares/error'));
app.listen(PORT, () => console.log(`API on :${PORT}`));
