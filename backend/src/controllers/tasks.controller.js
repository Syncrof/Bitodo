const { prisma } = require('../lib/prisma');
const { createTaskSchema, updateTaskSchema, listQuerySchema } = require('../validations/tasks.schema');

function vErr(msg) { return { status: 422, body: { error: { code: 'VALIDATION_ERROR', message: msg } } }; }

async function list(req, res) {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || 'validation error';
    const e = vErr(msg); return res.status(e.status).json(e.body);
  }
  const { status, priority, q, sort, order, page, limit } = parsed.data;

  const where = {};
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
  if (!task) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
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
    data: { title: title.trim(), description: description ?? null, status, priority, dueDate: dueDate ? new Date(dueDate) : null }
  });
  res.status(201).json(created);
}

async function update(req, res) {
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || 'validation error';
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: msg } });
  }
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
