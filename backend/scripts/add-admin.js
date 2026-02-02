/**
 * Добавить администратора по email (для продакшена).
 * Запуск в контейнере: node scripts/add-admin.js <email>
 * Пример: node scripts/add-admin.js larionov38@gmail.com
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];
if (!email) {
  console.error('Использование: node scripts/add-admin.js <email>');
  process.exit(1);
}

async function main() {
  await prisma.user.upsert({
    where: { email },
    create: { email, role: 'ADMIN' },
    update: { role: 'ADMIN' },
  });
  console.log('✓ Администратор добавлен:', email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
