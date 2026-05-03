import Database from "better-sqlite3";

const dbPath = process.env.DB_PATH;

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS equipments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    room TEXT NOT NULL,
    status TEXT NOT NULL
  )
`,
).run();

export default db;
