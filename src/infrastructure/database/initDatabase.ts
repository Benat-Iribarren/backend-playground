import { createDatabaseFile } from './createDatabaseFile';
import { createTables } from './createTables';
import { seedUser } from './seeders/userSeeder';

async function initDatabase() {
  try {
    await createDatabaseFile();
    await createTables();
    await seedUser();
    console.log('La base de datos ha sido inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initDatabase();
}
