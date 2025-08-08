import { db } from './createDatabaseFile';

export const createTables = async () => {
  db.exec(
    `
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nin TEXT NOT NULL,
        phone TEXT NOT NULL,
        isBlocked BOOLEAN NOT NULL
    );

    CREATE TABLE IF NOT EXISTS otp (
        userId INTEGER PRIMARY KEY, -- PK y FK
        hash TEXT NOT NULL,
        verificationCode TEXT NOT NULL,
        expirationDate TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id)
    );

    CREATE TABLE IF NOT EXISTS token (
        userId INTEGER PRIMARY KEY, -- PK y FK
        token TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id)
    );
    `,
  );
};
