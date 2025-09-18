const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const { hash } = require('../src/lib/hash');
  const passwordHash = await hash('demo1234');
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@bitodo.dev',
      name: 'Demo User',
      passwordHash,
    }
  });
  await prisma.task.createMany({
    data: [
      { title: 'Frontend UI tasarla', status: 'IN_PROGRESS', priority: 'MEDIUM', userId: demoUser.id },
      { title: 'QuickAdd component',  status: 'TODO',        priority: 'HIGH', dueDate: new Date(), userId: demoUser.id },
      { title: 'Kanban görünümü hazırla', status: 'DONE',   priority: 'LOW', userId: demoUser.id }
    ]
  });
  console.log('seed ok');
  process.exit(0);
})();
