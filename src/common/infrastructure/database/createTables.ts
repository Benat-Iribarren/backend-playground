import { sql } from 'kysely';
import db from './dbClient';

export const createTables = async () => {
  await sql`
  CREATE TABLE IF NOT EXISTS card (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      last4 TEXT NOT NULL,
      brand TEXT NOT NULL,
      expiryMonth INTEGER NOT NULL,
      expiryYear INTEGER NOT NULL,
      token TEXT NOT NULL,
      isPrimary BOOLEAN NOT NULL,
      FOREIGN KEY (userId) REFERENCES user(id)
    );
  `.execute(db);

  await sql`
  CREATE TABLE IF NOT EXISTS phone (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phoneNumber TEXT NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES user(id)
  );
`.execute(db);

  await sql`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nin TEXT NOT NULL,
        isBlocked BOOLEAN NOT NULL,
        fullName TEXT NOT NULL,
        email TEXT NOT NULL
    );
  `.execute(db);

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
