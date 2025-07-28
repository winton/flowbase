# Epic Outline: Advanced Workflow Control

This document outlines the tasks required to implement advanced workflow control features, including configurable error handling and step-level retries.

## 1. Configurable Error Handling

This feature will allow users to define how a workflow should respond to errors at both the workflow and step level.

### 1.1. Workflow-Level Error Handling
- **Data Model:** Extend the `DBWorkflowDefinition` to include an optional `onError` property. This property will specify a sequence of steps to execute when an unhandled error occurs in the workflow.
- **Workflow Executor:** Modify the `workflowExecutor` to catch errors during step execution. If an `onError` block is defined, the executor will transition to running the error handling steps.
- **Validation:** Update `workflowValidation` to ensure the `onError` steps are valid.

### 1.2. Step-Level Error Handling
- **Data Model:** Update the workflow step definition to include an optional `onError` property. This will allow a specific error-handling path for that individual step.
- **Workflow Executor:** The executor must be updated to check for step-level `onError` handlers before falling back to the workflow-level handler.

## 2. Step-Level Retries

This feature will add resilience to workflows by allowing individual steps to be retried automatically.

### 2.1. Retry Data Model
- **Step Definition:** Extend the step definition in `workflowComposition.ts` to include an optional `retry` object. This object will contain properties like `maxAttempts`, `delay`, and `backoffFactor`.
- **Database Model:** Update the `DBWorkflowDefinition` to persist these new retry settings.

### 2.2. Retry Logic in Executor
- **Workflow Executor:** Modify the `workflowExecutor` to handle retries. When a step with a `retry` policy fails, the executor will wait for the specified `delay` and then re-run the step, up to `maxAttempts`.
- **State Management:** The executor must track the current attempt number for each retried step.

### 2.3. Exponential Backoff
- **Executor Logic:** Implement an exponential backoff strategy for retries. The delay between retries will increase based on the `backoffFactor`. 