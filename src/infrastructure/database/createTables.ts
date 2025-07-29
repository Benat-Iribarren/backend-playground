import fs from 'fs'
import Database from 'better-sqlite3';

fs.mkdirSync('./data', { recursive: true })
const db = new Database('./data/sequraBackendDB.sqlite');

db.exec(
    `CREATE TABLE IF NOT EXISTS otp (
        hash TEXT PRIMARY KEY,
        otp TEXT NOT NULL,
        expirationDate TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS token (
        hash TEXT PRIMARY KEY,
        token TEXT NOT NULL
    );
    `
)
