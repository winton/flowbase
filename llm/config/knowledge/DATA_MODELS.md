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
export interface VariableDefinition {
  name: string;
  schema: z.ZodSchema<unknown>;
  zodCode: string;
  type: string;
}
```

### WorkflowDefinition (workflowComposition.ts)
```ts
export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffFactor?: number;
}

export interface FunctionStep {
  fn: string;
  args?: unknown[];
  output?: string;
  onError?: WorkflowStep[];
  retry?: RetryOptions;
}

export interface VariableStep {
  var: string;
  value?: unknown;
  output?: string;
  onError?: WorkflowStep[];
  retry?: RetryOptions;
}

export type WorkflowStep = FunctionStep | VariableStep;

export interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
  onError?: WorkflowStep[];
}
```

## Database Module (`packages/db/src`)

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
  steps: WorkflowStep[];
  onError?: WorkflowStep[];
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