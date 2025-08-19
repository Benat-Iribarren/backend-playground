import { createTables } from './createTables';
import { seedUser } from './seeders/userSeeder';

export async function initTestDatabase() {
  try {
    await createTables();
    await seedUser();
  } catch (error) {
    console.error('Error inicializando la base de datos de test:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initTestDatabase();
}
