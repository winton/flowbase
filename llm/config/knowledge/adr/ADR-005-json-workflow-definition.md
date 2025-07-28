# ADR 005: JSON for Workflow Definition and Exchange

Date: 2024-12-20

## Status

Accepted

## Context

A standardized, human-readable format was required for defining workflows and for importing/exporting them via the CLI. The format needed to be simple, widely supported, and capable of representing a sequence of steps involving functions and variables. Alternatives like YAML or a custom domain-specific language (DSL) were considered, but JSON was chosen for its ubiquity and simplicity.

## Decision

Workflows are defined as plain JSON objects. A workflow consists of an `id`, a `name`, and an array of `steps`. Each step is an object with either a `fn` key for function calls or a `var` key for variable assignments. This structure is used for both in-memory representation and for the files handled by the `workflow:import` and `workflow:export` CLI commands.

## Consequences

**Positive:**
- **Universality:** JSON is supported by virtually every language and tool, making it easy to create, parse, and manipulate workflows.
- **Readability:** The structure is simple and human-readable, facilitating manual creation and debugging.
- **Simplicity:** Avoids the need for a custom parser, leveraging native `JSON.parse` and `JSON.stringify` capabilities.

**Negative:**
- **Verbosity:** JSON can be more verbose than formats like YAML.
- **No Comments:** JSON does not support comments, which can make complex workflows harder to document inline.
- **Rigid Schema:** While the structure is simple, ensuring correctness requires validation logic, as JSON itself has no schema enforcement. 