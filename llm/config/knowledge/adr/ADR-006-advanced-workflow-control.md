# ADR-006: Advanced Workflow Control

Date: 2024-07-26

## Status

Accepted

## Context

The initial implementation of the workflow engine provided a solid foundation for defining and executing simple, linear workflows. However, to support more complex, real-world use cases, the engine needed more sophisticated control flow mechanisms. Specifically, there was no built-in support for handling errors that might occur during a step's execution, nor was there a way to automatically retry a step that might fail due to transient issues (e.g., temporary network problems).

## Decision

To address these limitations, we have implemented a set of advanced workflow control features:

1.  **Step-Level Error Handling:** Each step in a workflow can now have an optional `onError` block. This block is a standard array of workflow steps that will be executed if the primary step fails. This allows for fine-grained error handling, such as running compensation logic or logging detailed error information.

2.  **Workflow-Level Error Handling:** In addition to step-level handlers, the entire workflow can have an `onError` block. This serves as a global catch-all for any unhandled errors that occur in steps without their own `onError` block.

3.  **Configurable Retries with Exponential Backoff:** Each step can now have an optional `retry` object. This object allows for configuring the maximum number of retry attempts (`maxAttempts`), the initial delay between retries (`delay`), and a `backoffFactor` for implementing exponential backoff. This provides resilience for workflows that interact with potentially unreliable services.

## Consequences

**Positive:**

*   **Increased Robustness:** Workflows are now more resilient to transient failures and can gracefully handle expected errors.
*   **Greater Flexibility:** Developers have more control over how workflows behave under failure conditions.
*   **Improved Debugging:** `onError` blocks can be used to implement custom logging and reporting, making it easier to diagnose issues in complex workflows.

**Negative:**

*   **Increased Complexity:** Workflow definitions can become more complex with the addition of `onError` and `retry` configurations.
*   **Potential for Infinite Loops:** Care must be taken to avoid creating scenarios where a failing step in an `onError` block could lead to an infinite loop. This is something we may need to address with additional safeguards in the future. 