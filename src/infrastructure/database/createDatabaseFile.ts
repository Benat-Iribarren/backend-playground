import fs from 'fs';
import Database from 'better-sqlite3';

export const createDatabaseFile = async () => {
  fs.mkdirSync('./data', { recursive: true });
};

export const db = new Database('./data/sequraBackendDB.sqlite');
