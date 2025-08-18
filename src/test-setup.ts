import { createTables } from './auth/infrastructure/database/createTables';
import { seedUser } from './auth/infrastructure/database/seeders/userSeeder';

// Global test setup - runs before all tests
beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    try {
      console.log('Setting up test database (in-memory)...');
      await createTables();
      await seedUser();
      console.log('Test database setup complete!');
    } catch (error) {
      console.error('Error setting up test database:', error);
      throw error;
    }
  }
}, 30000); // 30 second timeout for database setup
