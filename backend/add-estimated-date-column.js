const sqlite3 = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
console.log('Opening database:', dbPath);

const db = sqlite3(dbPath);

try {
  // Проверяем, существует ли уже колонка
  const tableInfo = db.prepare("PRAGMA table_info(configurator_settings)").all();
  const hasColumn = tableInfo.some(col => col.name === 'estimated_date');
  
  if (hasColumn) {
    console.log('Column estimated_date already exists!');
  } else {
    console.log('Adding estimated_date column...');
    db.prepare('ALTER TABLE configurator_settings ADD COLUMN estimated_date TEXT').run();
    console.log('Column estimated_date added successfully!');
  }
  
  // Проверяем результат
  const updatedInfo = db.prepare("PRAGMA table_info(configurator_settings)").all();
  console.log('Table structure:', updatedInfo.map(c => c.name));
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}

