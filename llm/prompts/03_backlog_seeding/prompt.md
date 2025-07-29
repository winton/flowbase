# Step 3: Backlog Seeding

!include ../partials/shared_guidelines.md

Condition: `state/EPICS.md` exists, but `state/todos.yaml` is empty or has no actionable tasks (status `pending`, no unmet deps).

Action:
1. Read `state/EPICS.md`.
2. Brainstorm up to three high-value, concrete feature tasks that would advance the first incomplete epic.
3. For each task, create a YAML object (`BACKLOG_SCHEMA.md` for fields). Assign ID (e.g. FEAT-1), `project: core`, `kind: feature`.
4. Append tasks to `state/todos.yaml`.
5. Update `state/state.yaml` (`step: 4`, `epic: <current epic>`, `task: ""`, `detected: true`).
6. Show diffs for `todos.yaml` and `state.yaml`.  