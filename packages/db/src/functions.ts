import type Database from 'better-sqlite3';

export interface DBFunctionDefinition {
  id: string;
  name: string;
  description?: string | null;
  inputVars: string[];
  outputVars: string[];
  code: string;
}

// Database row interface for function records
interface DBFunctionRow {
  id: string;
  name: string;
  description: string | null;
  inputVars: string; // JSON string
  outputVars: string; // JSON string
  code: string;
}

export function saveFunction(db: Database.Database, fn: DBFunctionDefinition): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO functions (id, name, description, inputVars, outputVars, code)
    VALUES (@id, @name, @description, @inputVars, @outputVars, @code)
  `);
  stmt.run({
    id: fn.id,
    name: fn.name,
    description: fn.description,
    inputVars: JSON.stringify(fn.inputVars),
    outputVars: JSON.stringify(fn.outputVars),
    code: fn.code
  });
}

export function getFunction(db: Database.Database, id: string): DBFunctionDefinition {
  try {
    const row = db.prepare(`SELECT * FROM functions WHERE id = ?`).get(id) as DBFunctionRow | undefined;
    if (!row) {
      throw new Error(`Function with id '${id}' not found`);
    }
    
    // Handle potential JSON parsing errors
    let inputVars: string[] = [];
    let outputVars: string[] = [];
    
    try {
      inputVars = JSON.parse(row.inputVars);
    } catch (parseError) {
      console.warn(`Invalid JSON in inputVars for function ${id}, using empty array`);
      inputVars = [];
    }
    
    try {
      outputVars = JSON.parse(row.outputVars);
    } catch (parseError) {
      console.warn(`Invalid JSON in outputVars for function ${id}, using empty array`);
      outputVars = [];
    }
    
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      inputVars,
      outputVars,
      code: row.code
    };
  } catch (error) {
    throw error;
  }
}

export function listFunctions(db: Database.Database): DBFunctionDefinition[] {
  const rows = db.prepare(`SELECT * FROM functions`).all() as DBFunctionRow[];
  return rows.map((row: DBFunctionRow) => {
    let inputVars: string[] = [];
    let outputVars: string[] = [];
    
    try {
      inputVars = JSON.parse(row.inputVars);
    } catch (parseError) {
      console.warn(`Invalid JSON in inputVars for function ${row.id}, using empty array`);
      inputVars = [];
    }
    
    try {
      outputVars = JSON.parse(row.outputVars);
    } catch (parseError) {
      console.warn(`Invalid JSON in outputVars for function ${row.id}, using empty array`);
      outputVars = [];
    }
    
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      inputVars,
      outputVars,
      code: row.code
    };
  });
} 