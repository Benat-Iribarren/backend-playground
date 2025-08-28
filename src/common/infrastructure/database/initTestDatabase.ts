import { createTables } from './createTables';
import { seedUser } from './seeders/userSeeder';

export async function initTestDatabase() {
  await createTables();
  await seedUser();
}

if (require.main === module) {
  initTestDatabase()
    .then(() => {
      console.log('Base de datos de test inicializada.');
    })
    .catch((error) => {
      console.error('Error inicializando la base de datos de test:', error);
      process.exit(1);
    });
}
