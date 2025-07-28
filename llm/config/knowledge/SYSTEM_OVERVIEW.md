# System Overview

This document describes the current implementation of the `flowbase` codebase (excluding the LLM framework and tests).

## Implemented Components

### `packages/cli` - Command Line Interface
Provides a command-line interface via a custom `CLIProgram` class. Currently supports:
- `wizard`: interactive CLI wizard to guide users through creating their first workflow
- `workflow:import`: import a workflow from JSON file
- `workflow:export`: export a workflow to JSON file

### `packages/core` - Workflow Engine
Core workflow execution and validation logic:
- `FunctionRegistry`: manages function definitions with type metadata
- `workflowComposition`: loads and validates workflow JSON definitions
- `workflowValidation`: type-checks workflow steps against function signatures
- `workflowExecutor`: executes validated workflows step-by-step, with support for step-level error handling and retries
- `codeEvaluator`: evaluates TypeScript code using esbuild for dynamic function execution
- `VariableRegistry`: stores and validates variables using Zod schemas

### `packages/db` - Database Layer
SQLite-backed persistence layer with full CRUD operations:
- `index.ts`: database bootstrapping with schema creation for functions, variables, and workflows
- `functions.ts`: function management (save, get, list) with I/O metadata persistence
- `variables.ts`: variable management with Zod schema support
- `workflows.ts`: workflow persistence with JSON-encoded steps

## Architecture Flow

1. **Functions** are defined with TypeScript code and stored in SQLite with metadata
2. **Variables** are defined with Zod schemas and persisted to the database
3. **Workflows** are composed as JSON and validated against available functions/variables
4. **Execution** involves type-checking followed by step-by-step function invocation
5. **CLI** provides the user interface for managing and running workflows

## Current State

The system is feature-complete according to the initial project epics. All core components for defining, persisting, and executing workflows are in place. The CLI provides essential user interactions, and the database layer ensures data integrity.

The focus has now shifted to maintenance and stabilization, including ongoing improvements to error handling, type safety, and documentation.