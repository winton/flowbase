import Database from 'better-sqlite3';

export function bootstrapDatabase(path: string) {
  const db = new Database(path);
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS functions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      inputVars TEXT NOT NULL,
      outputVars TEXT NOT NULL,
      code TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS variables (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      code TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      steps TEXT NOT NULL,
      onError TEXT
    );
  `);

  return db;
} 