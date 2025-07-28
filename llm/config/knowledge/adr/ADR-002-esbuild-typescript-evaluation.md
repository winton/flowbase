# ADR 002: ESBuild for TypeScript Code Evaluation

Date: 2024-12-19

## Status

Accepted

## Context

The flowbase system needs to evaluate TypeScript code dynamically for user-defined functions. This requires transpiling TypeScript to JavaScript and executing it safely within the Node.js environment.

Requirements:
- Fast transpilation for responsive workflow execution
- Support for modern TypeScript features
- Simple integration without complex configuration
- Good error reporting for malformed code

Alternative options considered:
- ts-node: Slower compilation and heavier runtime overhead
- TypeScript Compiler API: More complex setup and slower
- Babel: Additional configuration complexity for TypeScript
- SWC: Newer but less ecosystem stability

## Decision

We will use ESBuild for TypeScript transpilation in the codeEvaluator module.

## Consequences

**Positive:**
- Extremely fast transpilation (10-100x faster than alternatives)
- Simple API with minimal configuration required
- Built-in TypeScript support with good error messages
- Small bundle size and lightweight runtime
- Active development and good ecosystem support

**Negative:**
- Limited customization compared to full TypeScript compiler
- Some edge cases with complex TypeScript features may not be supported
- Requires keeping ESBuild as a dependency

---
*This template follows the MADR (Markdown Architecture Decision Record) 2.1.2 format.* 