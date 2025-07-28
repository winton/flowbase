# Backlog Schema (`llm/config/todos.yaml`)

This project stores its engineering backlog in the YAML file `llm/config/todos.yaml`. The file contains an **ordered list** of task objects.

## Task Object Fields

| Field        | Type   | Required | Example | Description |
|--------------|--------|----------|---------|-------------|
| id           | string | ✓        | API-1   | Stable identifier; human-readable prefix + integer. Never changes. |
| content      | string | ✓        | Implement user API | Imperative, ≤ 120 chars, describes the work. |
| priority     | enum   | ✓        | high    | `critical`, `high`, `medium`, `low`. |
| area         | string | ✓        | backend | Logical part of the system (frontend, backend, infra, docs…). |
| estimate     | int    | ✓        | 3       | Fibonacci (1,2,3,5,8…). |
| project      | string | ✓        | core    | Originating workflow (`core`, `bug-security`, `doc-sync`, etc.). |
| kind         | enum   | ✓        | feature | `feature`, `bugfix`, `security`, `refactor`, `docs`. |
| epic         | string | –        | auth    | Epic slug this task belongs to. |
| depends_on   | list   | –        | [DB-4]  | Array of task IDs that must complete first. |
| status       | enum   | ✓        | pending | `pending`, `in_progress`, `completed`, `blocked`, `cancelled`. |
| created_at   | date   | –        | 2024-07-28 | ISO-8601 creation timestamp. |

## File Format Example

```yaml
- id: API-1
  content: Implement user API
  priority: high
  area: backend
  estimate: 3
  project: core
  kind: feature
  epic: auth
  status: pending

- id: DB-4
  content: Create users table
  priority: high
  area: backend
  estimate: 2
  project: core
  kind: feature
  epic: auth
  status: completed
``` 