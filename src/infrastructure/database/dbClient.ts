import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import { Database as DBTypes } from './schema';

const dbFile =
  process.env.SQLITE_DB_PATH ||
  (process.env.NODE_ENV === 'test'
    ? './data/test-sequraBackendDB.sqlite'
    : './data/sequraBackendDB.sqlite');

const db = new Kysely<DBTypes>({
  dialect: new SqliteDialect({
    database: new Database(dbFile),
  }),
});

export default db;
