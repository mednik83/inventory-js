import Database from "better-sqlite3";

const db = new Database("./inventory.sqlite");

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
