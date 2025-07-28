# ADR 004: Variable Registry for State Management

Date: 2024-12-20

## Status

Accepted

## Context

During workflow execution, there is a need to manage state, allowing data produced in one step to be consumed by subsequent steps. This requires a mechanism for storing and retrieving typed variables at runtime. The solution needed to be integrated directly into the `runWorkflow` execution loop and support dynamic type validation to ensure data integrity.

## Decision

An in-memory `VariableRegistry` class was implemented in `packages/core`. This registry is responsible for holding variable values during a single workflow execution. It uses Zod schemas to enforce type correctness at the point of value assignment, preventing type-related errors downstream. Values are referenced in workflow steps using a `$` prefix (e.g., `"$myVar"`).

## Consequences

**Positive:**
- **Type Safety:** Zod-based validation ensures that variables hold data conforming to their defined schemas.
- **Decoupled State:** Separates state management from function implementations, as functions receive plain values.
- **Simplicity:** The in-memory approach is easy to implement and understand for single-process, synchronous workflows.

**Negative:**
- **Ephemeral State:** The registry is not persistent; state is lost after the workflow completes. This is acceptable for the current design but would need to be re-evaluated for long-running or resumable workflows.
- **Limited Scope:** The registry is scoped to a single execution and does not support shared state across different workflow runs. 