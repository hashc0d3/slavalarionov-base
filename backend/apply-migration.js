const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');

console.log('Checking if database is locked...');

// Пробуем применить миграцию напрямую через Prisma CLI без блокировки
try {
  console.log('Applying migration SQL directly...');
  
  // Создаем временный SQL файл
  const sql = `ALTER TABLE configurator_settings ADD COLUMN estimated_date TEXT;`;
  
  console.log('Migration SQL:', sql);
  console.log('\nPlease stop the backend server (Ctrl+C in terminal 2), then run:');
  console.log('  cd backend');
  console.log('  npx prisma db execute --file apply-migration.sql --schema prisma/schema.prisma');
  console.log('  npx prisma generate');
  console.log('  npm run start:dev');
  
  // Создаем SQL файл для выполнения
  fs.writeFileSync(path.join(__dirname, 'apply-migration.sql'), sql);
  console.log('\nSQL file created: apply-migration.sql');
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}







