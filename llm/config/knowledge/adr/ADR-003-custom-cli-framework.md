# ADR 003: Custom CLI Framework for Core Operations

Date: 2024-12-20

## Status

Accepted

## Context

The `flowbase` system requires a command-line interface (CLI) to allow users to interact with the workflow engine. Key considerations included minimizing external dependencies, maintaining a lightweight footprint, and ensuring the interface could be easily extended. While mature libraries like `commander` or `yargs` offer rich features, they introduce dependencies and overhead that are not strictly necessary for the project's core requirements.

## Decision

A minimal, custom `CLIProgram` class was implemented directly within the `packages/cli` module. This class provides a simple, chainable interface for defining commands, descriptions, and actions, fulfilling the immediate needs of the system without external libraries.

## Consequences

**Positive:**
- **Zero Dependencies:** The CLI adds no external packages, keeping the project lean.
- **Simplicity:** The API is straightforward and tailored specifically for `flowbase`'s needs.
- **Extensibility:** New commands can be added easily by extending the existing pattern.

**Negative:**
- **Manual Implementation:** Features like argument parsing, help generation, and input validation must be implemented manually if needed.
- **Limited Feature Set:** Lacks the advanced capabilities (e.g., complex argument validation, sub-command nesting) found in mature CLI libraries. This is acceptable for the current scope but may require refactoring if CLI complexity grows significantly. 