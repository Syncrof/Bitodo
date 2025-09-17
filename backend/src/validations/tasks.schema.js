const { z } = require('zod');
const Status = z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'TRASH']);
const Priority = z.enum(['LOW', 'MEDIUM', 'HIGH']);

const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'title is required'),
  description: z.string().optional(),
  status: Status.optional(),
  priority: Priority.optional(),
  dueDate: z.string().datetime().optional()
});

const updateTaskSchema = createTaskSchema.partial();

const listQuerySchema = z.object({
  status: Status.optional(),
  priority: Priority.optional(),
  q: z.string().optional(),
  sort: z.enum(['dueDate', 'priority', 'createdAt']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  date: z.enum(['today', 'upcoming']).optional()
});

module.exports = { createTaskSchema, updateTaskSchema, listQuerySchema };

// Step ve notes için ek şemalar
const createStepSchema = z.object({
  title: z.string().trim().min(1, 'Step title is required')
});

const updateStepSchema = z.object({
  title: z.string().trim().min(1).optional(),
  done: z.boolean().optional()
});

const updateNotesSchema = z.object({
  notes: z.string().optional()
});

module.exports.createStepSchema = createStepSchema;
module.exports.updateStepSchema = updateStepSchema;
module.exports.updateNotesSchema = updateNotesSchema;
