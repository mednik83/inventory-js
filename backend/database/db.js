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

const roomsCountRow = db
  .prepare(
    `
  SELECT COUNT(*) as count FROM rooms
`,
  )
  .get();

if (roomsCountRow.count === 0) {
  const insertRoom = db.prepare(
    `
  INSERT INTO rooms (name)
  VALUES (?)
  `,
  );
  for (let i = 1; i < 11; i++) {
    insertRoom.run(String(i));
  }
}

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
