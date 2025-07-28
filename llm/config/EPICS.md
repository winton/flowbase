# Flowbase Epics

This document outlines the key epics for the `flowbase` project, a dynamic TypeScript workflow engine focused on text-based, local, and dev-friendly operations.

## 1. Core Data Model & Persistence
   This epic establishes the foundational data structures for functions, variables, and workflows, and ensures their persistent storage in a local SQLite database. This is critical for the system to remember and retrieve its core definitions.

### 1.1 Function Management
    This sub-epic focuses on defining, storing, and retrieving TypeScript functions with their associated I/O metadata. This provides the building blocks for workflow automation.

### 1.2 Variable Management
    This sub-epic covers the definition, storage, and dynamic schema enforcement of typed variables using Zod. This ensures data integrity and flexibility within workflows.

### 1.3 Workflow Composition
    This sub-epic enables the definition of workflows as plain JSON, allowing users to compose sequences of functions and variable interactions. This provides the mechanism for orchestrating automated tasks.

## 2. Workflow Execution Engine
   This epic implements the core logic for executing defined workflows, including type-checking, dynamic input/output resolution, and execution tracing. This is where the automation capabilities of `flowbase` come alive.

### 2.1 Workflow Validation & Type-Checking
    This sub-epic ensures that workflows are syntactically correct and type-safe before execution. This prevents runtime errors and enhances development predictability.

### 2.2 Dynamic Execution & Tracing
    This sub-epic focuses on the step-by-step execution of workflows, dynamically resolving variable values and function outputs. It also includes the capability to output detailed execution traces for debugging and auditing, providing transparency into workflow behavior.

## 3. Command Line Interface (CLI)
   This epic develops a minimal, text-based interface for interacting with `flowbase`, enabling users to define, manage, and run functions, variables, and workflows. This provides the primary user interaction point for the MVP.

### 3.1 Function & Variable Definition CLI
    This sub-epic implements CLI commands for adding and managing functions and variables in the database. This allows users to quickly define their workflow building blocks.

### 3.2 Workflow Execution CLI
    This sub-epic provides CLI commands to trigger and monitor the execution of workflows. This is essential for users to run their automated processes.

## 4. Developer Experience & Tooling
   This epic focuses on aspects that enhance the developer experience, such as safe TypeScript evaluation and a well-structured project. This ensures `flowbase` is easy to use and extend for developers.

### 4.1 TypeScript Code Evaluation
    This sub-epic implements a mechanism for safely evaluating TypeScript code (for functions) within the `flowbase` environment using tools like ESBuild or `ts-node`. This enables dynamic code execution while maintaining type safety.

### 4.2 Project Structure & Dependencies
    This sub-epic establishes the recommended multi-package project structure and manages core dependencies. This provides a clear, maintainable foundation for ongoing development.

## 5. Advanced Workflow Control
   This epic introduces more sophisticated control flow mechanisms, enhancing the robustness and flexibility of workflow execution. It will focus on configurable error handling and retry policies.

### 5.1 Configurable Error Handling
    This sub-epic will allow developers to define custom error handling strategies within a workflow, such as catching specific errors, running a compensation workflow, or marking a step as failed but continuing execution.

### 5.2 Step-Level Retries
    This sub-epic will implement a mechanism for automatically retrying a failed workflow step with a configurable backoff strategy. This improves the resilience of workflows that interact with potentially unreliable external services. 