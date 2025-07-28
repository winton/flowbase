# ADR 001: SQLite with better-sqlite3 for Persistence Layer

Date: 2024-12-19

## Status

Accepted

## Context

The flowbase system requires a local persistence layer for storing functions, variables, and workflows. The system needs to be:
- Local and file-based (no external database server required)
- Fast for read/write operations during workflow execution
- Type-safe with good TypeScript integration
- Simple to set up for developers
- Suitable for the text-based, dev-friendly nature of the project

Alternative options considered:
- File-based JSON storage: Simple but lacks query capabilities and atomic transactions
- Embedded databases like LevelDB: More complex setup and less SQL familiarity
- PostgreSQL with pg: Requires external server setup
- SQLite with node-sqlite3: Slower performance than better-sqlite3

## Decision

We will use SQLite with the better-sqlite3 package as our persistence layer.

## Consequences

**Positive:**
- High performance synchronous operations suitable for workflow execution
- Native TypeScript support and excellent type safety
- Zero configuration - single file database
- ACID transactions ensure data integrity
- Familiar SQL interface for complex queries
- Excellent developer experience with simple setup

**Negative:**
- Limited to single-process access (acceptable for local development tool)
- Requires native compilation (handled well by better-sqlite3)
- Not suitable for distributed systems (not a requirement for MVP)

---
*This template follows the MADR (Markdown Architecture Decision Record) 2.1.2 format.* 