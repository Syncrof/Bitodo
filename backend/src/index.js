const express = require('express');
const cors = require('cors');
const tasks = require('./routes/tasks.routes');
const error = require('./middlewares/error');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/api/v1/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/v1/tasks', tasks);

app.use(error);

app.listen(PORT, () => console.log(`API listening http://localhost:${PORT}`));
