import { createTables } from './createTables';
import { seedUser } from './seeders/userSeeder';
import fs from 'fs';

const createDataDirectory = async () => {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data', { recursive: true });
  }
};

async function initDatabase() {
  try {
    await createDataDirectory();
    await createTables();
    await seedUser();
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initDatabase();
}
