const prisma = require('../lib/prisma');
const { createTaskSchema, updateTaskSchema, listQuerySchema } = require('../validations/tasks.schema');

function vErr(msg) { return { status: 422, body: { error: { code: 'VALIDATION_ERROR', message: msg } } }; }

async function list(req, res) {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || 'validation error';
    const e = vErr(msg); return res.status(e.status).json(e.body);
  }
  const { status, priority, q, sort = 'createdAt', order = 'desc', page, limit } = parsed.data;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Kullanıcı oturumu bulunamadı.' } });
  }
  const where = { userId: req.user.id };
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (q) where.title = { contains: q, mode: 'insensitive' };

  const take = Math.min(parseInt(limit) || 20, 100);
  const pageNum = Math.max(parseInt(page) || 1, 1);
  const skip = (pageNum - 1) * take;

  const [data, totalItems] = await Promise.all([
    prisma.task.findMany({ where, orderBy: { [sort]: order }, skip, take }),
    prisma.task.count({ where })
  ]);

  res.json({ data, meta: { page: pageNum, limit: take, totalItems, totalPages: Math.max(Math.ceil(totalItems / take), 1) } });
}

async function getById(req, res) {
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task || task.userId !== req.user.id) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
  res.json(task);
}

async function create(req, res) {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || 'validation error';
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: msg } });
  }
  const { title, description, status, priority, dueDate } = parsed.data;
  const created = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description ?? null,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user.id // Oturumdaki kullanıcının id'si
    }
  });
  res.status(201).json(created);
}

async function update(req, res) {
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || 'validation error';
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: msg } });
  }
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task || task.userId !== req.user.id) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
  const { title, description, status, priority, dueDate } = parsed.data;
  try {
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(priority !== undefined ? { priority } : {}),
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {})
      }
    });
    res.json(updated);
  } catch {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
  }
}

async function remove(req, res) {
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!task || task.userId !== req.user.id) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
  }
}

async function replace(req, res) {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || 'validation error';
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: msg } });
  }
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!task || task.userId !== req.user.id) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
  const { title, description, status, priority, dueDate } = parsed.data;
  try {
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        title: title.trim(),
        description: description ?? null,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    res.json(updated);
  } catch {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
  }
}

module.exports = { list, getById, create, update, remove, replace };

// Step CRUD
async function addStep(req, res) {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: 'Step title is required' } });
  }
  try {
    const step = await prisma.step.create({
      data: {
        title: title.trim(),
        taskId: req.params.id
      }
    });
    res.status(201).json(step);
  } catch {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
  }
}

async function updateStep(req, res) {
  const { title, done } = req.body;
  try {
    const step = await prisma.step.update({
      where: { id: req.params.stepId },
      data: {
        ...(title !== undefined ? { title: title.trim() } : {}),
        ...(done !== undefined ? { done } : {})
      }
    });
    res.json(step);
  } catch {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Step not found' } });
  }
}

async function deleteStep(req, res) {
  try {
    await prisma.step.delete({ where: { id: req.params.stepId } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Step not found' } });
  }
}

// Notes güncelleme
async function updateNotes(req, res) {
  const { notes } = req.body;
  try {
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { notes }
    });
    res.json(updated);
  } catch {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
  }
}

module.exports.addStep = addStep;
module.exports.updateStep = updateStep;
module.exports.deleteStep = deleteStep;
module.exports.updateNotes = updateNotes;
