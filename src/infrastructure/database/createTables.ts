import { db } from './createDatabaseFile';

export const createTables = async () => {
  db.exec(
    `CREATE TABLE IF NOT EXISTS otp (
        userId TEXT PRIMARY KEY,
        hash TEXT NOT NULL,
        verificationCode TEXT NOT NULL,
        expirationDate TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS token (
        userId NUMBER PRIMARY KEY,
        token TEXT NOT NULL
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
