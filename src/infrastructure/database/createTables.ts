import { db } from './createDatabaseFile';

export const createTables = async () => {
  db.exec(
    `CREATE TABLE IF NOT EXISTS otp (
        hash TEXT PRIMARY KEY,
        verificationCode TEXT NOT NULL,
        expirationDate TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS token (
        token TEXT PRIMARY KEY
    );
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nin TEXT NOT NULL,
        phone TEXT NOT NULL,
        isBlocked BOOLEAN NOT NULL
    );
    `,
  );
};
