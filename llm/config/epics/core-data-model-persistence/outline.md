# Bootstrap SQLite Database Schema

This outline describes the plan for the `bootstrapDatabase` function to initialize a SQLite database with core tables.

## Objectives

1. Use `better-sqlite3` to open or create a database file (or in-memory DB).  
2. Execute SQL statements to create the following tables:
   - `functions`  
   - `variables`  
   - `workflows`  
3. Export a function `bootstrapDatabase` that returns the initialized `Database` instance.

## Table Definitions (Example)

```sql
CREATE TABLE IF NOT EXISTS functions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  inputVars TEXT,
  outputVars TEXT,
  code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS variables (
  id TEXT PRIMARY KEY,
  description TEXT,
  code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workflows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  steps TEXT NOT NULL
);
```

## Next Steps

1. Implement `bootstrapDatabase` in `packages/db/src/index.ts`.  
2. Write the bootstrap logic and export the function.  
3. Run tests and iterate. 

## Function Management

This outline describes the plan for managing functions in the database.

### Objectives

1. Implement `saveFunction`, `getFunction`, and `listFunctions` in `packages/db/src/functions.ts`.
2. Store `inputVars` and `outputVars` as JSON strings in the `functions` table.
3. Use SQL `INSERT OR REPLACE` to save functions and `SELECT` queries to retrieve them.
4. Write tests to verify storing, retrieving, and listing function definitions. 

## Variable Management

This outline describes the plan for managing variables in the database.

### Objectives

1. Implement `saveVariable`, `getVariable`, and `listVariables` in `packages/db/src/variables.ts`.
2. Store `description` and `code` fields correctly in the `variables` table.
3. Use SQL `INSERT OR REPLACE` to save variables and `SELECT` queries to retrieve them.
4. Write tests in `tests/db-variable-management.test.ts` to verify storing, retrieving, and listing variable definitions. 

## Workflow Composition

This outline describes the plan for managing workflows in the database.

### Objectives

1. Implement `saveWorkflow`, `getWorkflow`, and `listWorkflows` in `packages/db/src/workflows.ts`.
2. Store `steps` as JSON strings in the `workflows` table.
3. Use SQL `INSERT OR REPLACE` to save workflows and `SELECT` queries to retrieve them.
4. Write tests in `tests/db-workflow-management.test.ts` to verify storing, retrieving, and listing workflow definitions. 