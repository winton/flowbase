# Workflow Execution Engine

This outline describes the plan for workflow validation and type-checking within the execution engine.

## Objectives

1. Implement `validateWorkflowTypes(workflow, registry)` to check that each step's arguments match the registered function input types.
2. Throw errors for argument count mismatches and type mismatches with descriptive messages.
3. Create tests in `tests/workflow-validation.test.ts` to drive development for argument validation (FEAT-7).
4. Integrate type-checking into the workflow execution flow before running steps (FEAT-9). 
5. Implement `runWorkflow(workflow, registry)` in `packages/core/src/workflowExecutor.ts`, invoking type validation via `validateWorkflowTypes` before executing steps and returning an array of results. 