const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  await prisma.task.createMany({
    data: [
      { title: 'Frontend UI tasarla', status: 'IN_PROGRESS', priority: 'MEDIUM' },
      { title: 'QuickAdd component',  status: 'TODO',        priority: 'HIGH', dueDate: new Date() },
      { title: 'Kanban görünümü hazırla', status: 'DONE',   priority: 'LOW' }
    ]
  });
  console.log('seed ok');
  process.exit(0);
})();
