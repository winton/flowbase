# Data Models

This document summarizes key data structures across all flowbase modules.

## Core Module (`packages/core/src/`)

### FunctionDefinition (FunctionRegistry.ts)
```ts
export interface FunctionDefinition {
  name: string;
  implementation: (...args: unknown[]) => unknown;
  inputTypes: string[];
  outputType: string;
}
```

### Variable (VariableRegistry.ts)
```ts
export interface Variable<T> {
  id: string;
  name: string;
  schema: z.ZodType<T>;
  value: T;
}
```

### WorkflowDefinition (workflowComposition.ts)
```ts
export interface WorkflowDefinition {
  id: string;
  name: string;
  steps: { fn: string, args: Record<string, any> }[] | { var: string, value: any }[];
}
```

## Database Module (`packages/db/src/`)

### DBFunctionDefinition (functions.ts)
```ts
export interface DBFunctionDefinition {
  id: string;
  name: string;
  description?: string | null;
  inputVars: string[];
  outputVars: string[];
  code: string;
}
```

### DBVariableDefinition (variables.ts)
```ts
export interface DBVariableDefinition {
  id: string;
  name: string;
  description?: string | null;
  code: string; // Zod schema code
}
```

### DBWorkflowDefinition (workflows.ts)
```ts
export interface DBWorkflowDefinition {
  id: string;
  name: string;
  steps: { fn: string, args: Record<string, any> }[] | { var: string, value: any }[]; // JSON-serialized workflow steps
}
```

## CLI Module (`packages/cli/src/`)

### CLIProgram (cli.ts)
```ts
class CLIProgram {
  commands: Array<{
    name: () => string;
    description?: string;
    action?: (...args: any[]) => any;
  }>;
}
```

## Database Schema

SQLite tables:
- `functions`: stores function definitions with code and metadata
- `variables`: stores variable definitions with Zod schemas
- `workflows`: stores workflow definitions with JSON-encoded steps 