import './createTables';
import { seedUser } from './seeders/userSeeder';

async function initDatabase() {
  try {
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
