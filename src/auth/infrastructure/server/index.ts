import { build, start } from './serverBuild';
import { createTables } from '../database/createTables';
import { seedUser } from '../database/seeders/userSeeder';

const fastify = build();
export default fastify;

if (require.main === module) {
  const PORT = 3000;

  // Initialize database for test environment
  if (process.env.NODE_ENV === 'test') {
    console.log('Initializing test database...');
    createTables()
      .then(() => seedUser())
      .then(() => {
        console.log('Test database initialized successfully');
        start(fastify, PORT);
      })
      .catch((error) => {
        console.error('Error initializing test database:', error);
        process.exit(1);
      });
  } else {
    start(fastify, PORT);
  }
}
