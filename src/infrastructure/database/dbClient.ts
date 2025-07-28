import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import { Database as DBTypes } from './schema';

const db = new Kysely<DBTypes>({
  dialect: new SqliteDialect({
    database: new Database('./data/sequraBackendDB.sqlite'),
  }),
});

export default db;
