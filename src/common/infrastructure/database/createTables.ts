import { createUserTables } from '@user/infrastructure/database/createUserTables';
import { createAuthTables } from '@auth/infrastructure/database/createAuthTables';

export const createTables = async () => {
  await createUserTables();
  await createAuthTables();
};
