import type Database from 'better-sqlite3';

export interface DBVariableDefinition {
  id: string;
  name: string;
  description?: string | null;
  code: string;
}

// Database row interface for variable records  
interface DBVariableRow {
  id: string;
  name: string;
  description: string | null;
  code: string;
}

export function saveVariable(db: Database.Database, variable: DBVariableDefinition): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO variables (id, name, description, code)
    VALUES (@id, @name, @description, @code)
  `);
  stmt.run({
    id: variable.id,
    name: variable.name,
    description: variable.description,
    code: variable.code
  });
}

export function getVariable(db: Database.Database, id: string): DBVariableDefinition {
  const row = db.prepare(`SELECT * FROM variables WHERE id = ?`).get(id) as DBVariableRow | undefined;
  if (!row) {
    throw new Error(`Variable with id '${id}' not found`);
  }
  
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    code: row.code
  };
}

export function listVariables(db: Database.Database): DBVariableDefinition[] {
  const rows = db.prepare(`SELECT * FROM variables`).all() as DBVariableRow[];
  return rows.map((row: DBVariableRow) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    code: row.code
  }));
} 