import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import { Database as DBTypes } from './schema';
import 'dotenv/config';

const getDbFilePath = () => {
  if (process.env.NODE_ENV === 'test') {
    return ':memory:';
  }
  return process.env.DATABASE_FILE_PATH;
};

const db = new Kysely<DBTypes>({
  dialect: new SqliteDialect({
    database: new Database(getDbFilePath()),
  }),
});

export default db;
