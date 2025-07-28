# Step 4: Test-Driven Feature Implementation

Condition: An actionable task exists in `config/todos.yaml`.

Action:
1. Select task:
   * Identify the first incomplete epic in `config/EPICS.md`.
   * Select the top-priority `pending` task for that epic from `config/todos.yaml`.
   * If no task is available for the current epic but other epics have tasks, you may proceed with them.
   * If all epics are complete, proceed to Step 5.
   * If no actionable tasks exist at all, return to Step 3.
2. Write failing test:
   * If absent, create `config/epics/<epic_slug>/outline.md` with a short plan.
   * Write the minimum test code required to reproduce a failure for the selected task. It must fail.
   * Output: the diff for the test file(s).
3. Implement code:
   * Write the minimum application code to make the test pass.
   * Run quality gates from `config/gates.yaml`.
   * If gates fail, attempt to fix the code up to three times.
   * If still failing after three attempts, create `llm/config/REVIEW_REQUESTED.md` with the task ID, final diff, and error logs. Output its contents and stop.
   * Output: the diff for the application code.
4. Refactor & update backlog:
   * Optionally refactor the code just written. Re-run tests if you do.
   * Update the task’s `status` to `completed` in `config/todos.yaml`.
   * Show diffs for `todos.yaml` and any refactored files.
5. Update `config/state.yaml` with:
   * `current_step`: 4 if actionable tasks remain, otherwise 5.
   * `epic_slug`: the current epic slug (or empty if none remain).
   * `task_id`: the ID of the task you just completed (or empty if none remain).
6. Show diff for `state.yaml`. 