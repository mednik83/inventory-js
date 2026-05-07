import Database from "better-sqlite3";

const dbPath = process.env.DB_PATH;

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
  )
  `,
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS equipments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    room_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
  )
`,
).run();

export default db;
