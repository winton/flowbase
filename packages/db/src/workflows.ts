import type Database from 'better-sqlite3';
import type { WorkflowStep } from '../../core/src/workflowComposition';

export interface DBWorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
  onError?: WorkflowStep[];
}

// Database row interface for workflow records
interface DBWorkflowRow {
  id: string;
  name: string;
  steps: string; // JSON string
  onError?: string; // JSON string
}

export function saveWorkflow(db: Database.Database, wf: DBWorkflowDefinition): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO workflows (id, name, steps, onError)
    VALUES (@id, @name, @steps, @onError)
  `);
  stmt.run({
    id: wf.id,
    name: wf.name,
    steps: JSON.stringify(wf.steps),
    onError: wf.onError ? JSON.stringify(wf.onError) : null
  });
}

export function getWorkflow(db: Database.Database, id: string): DBWorkflowDefinition {
  const row = db.prepare(`SELECT * FROM workflows WHERE id = ?`).get(id) as DBWorkflowRow | undefined;
  if (!row) {
    throw new Error(`Workflow with id '${id}' not found`);
  }
  
  let steps: WorkflowStep[] = [];
  try {
    steps = JSON.parse(row.steps);
  } catch {
    console.warn(`Invalid JSON in steps for workflow ${id}, using empty array`);
    steps = [];
  }

  let onError: WorkflowStep[] | undefined;
  if (row.onError) {
    try {
      onError = JSON.parse(row.onError);
    } catch {
      console.warn(`Invalid JSON in onError for workflow ${id}, using undefined`);
      onError = undefined;
    }
  }
  
  return {
    id: row.id,
    name: row.name,
    steps,
    onError
  };
}

export function listWorkflows(db: Database.Database): DBWorkflowDefinition[] {
  const rows = db.prepare(`SELECT * FROM workflows`).all() as DBWorkflowRow[];
  return rows.map((row: DBWorkflowRow) => {
    let steps: WorkflowStep[] = [];
    try {
      steps = JSON.parse(row.steps);
    } catch {
      console.warn(`Invalid JSON in steps for workflow ${row.id}, using empty array`);
      steps = [];
    }

    let onError: WorkflowStep[] | undefined;
    if (row.onError) {
      try {
        onError = JSON.parse(row.onError);
      } catch {
        console.warn(`Invalid JSON in onError for workflow ${row.id}, using undefined`);
        onError = undefined;
      }
    }
    
    return {
      id: row.id,
      name: row.name,
      steps,
      onError
    };
  });
} 