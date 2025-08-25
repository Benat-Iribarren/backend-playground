import { sql } from 'kysely';
import db from '@common/infrastructure/database/dbClient';

export const createAuthTables = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS otp (
        userId INTEGER PRIMARY KEY, -- PK y FK
        hash TEXT NOT NULL,
        verificationCode TEXT NOT NULL,
        expirationDate TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id)
    );
  `.execute(db);

  await sql`
    CREATE TABLE IF NOT EXISTS token (
        userId INTEGER PRIMARY KEY, -- PK y FK
        token TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id)
    );
  `.execute(db);
};
