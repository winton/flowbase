# Dependency Graph

This document shows the dependencies between major modules in the `flowbase` codebase.

## Package Dependencies

```
packages/cli -> packages/core (planned integration)
packages/core -> packages/db (for function/workflow loading)
packages/db -> better-sqlite3 (external dependency)
packages/core -> esbuild (for TypeScript evaluation)
```

## Current Module Relationships

- **`packages/db`**: Standalone database layer with SQLite persistence for all entities
- **`packages/core`**: Workflow engine that depends on database layer for loading functions/workflows
- **`packages/cli`**: Command-line interface with placeholder implementations for workflow management

## External Dependencies

- `better-sqlite3`: High-performance SQLite bindings
- `esbuild`: Fast TypeScript transpilation for dynamic code evaluation
- `commander` (planned): CLI framework for command parsing

## Integration Status

The modules are designed to work together but CLI integration with core/db layers is not yet complete. All database and core functionality is implemented and tested. 