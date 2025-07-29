# Step 4: Test-Driven Feature Implementation

!include ../partials/shared_guidelines.md

Condition: An actionable task exists in `state/todos.yaml`.

Action:
1. Select task:
   * If any epics remain **incomplete**, select the first incomplete epic in `state/EPICS.md` and choose the top-priority `pending` task for that epic from `state/todos.yaml`.
   * Otherwise (all epics complete), select the top-priority `pending` task from `state/todos.yaml` regardless of its `epic` field (this includes maintenance or stand-alone tasks).
   * If **no** actionable tasks exist at all, return to Step 3.
2. Write failing test:
   * If absent, create `state/epics/<epic_slug>/outline.md` with a short plan.
   * Write the minimum test code required to reproduce a failure for the selected task. It must fail.
   * Output: the diff for the test file(s).
3. Implement code:
   * Write the minimum application code to make the test pass.
   * Run all quality gates using the `llm/scripts/run_gates.sh all` command.
   * If gates fail, attempt to fix the code up to three times.
   * If still failing after three attempts, create `llm/state/REVIEW_REQUESTED.md` with the task ID, final diff, and error logs. Output its contents and stop.
   * Output: the diff for the application code.
4. Refactor & update backlog:
   * Optionally refactor the code just written. Re-run tests if you do.
   * Remove the completed task entry from `state/todos.yaml` and append it (including a new `completed_at` timestamp) to `state/ended.yaml`.
   * Append a one-sentence summary of the completed task to its epic outline (`state/epics/<epic_slug>/outline.md`).
   * Show diffs for `todos.yaml`, `ended.yaml`, and any refactored files.
5. Update `state/state.yaml` with:
   * `step`: 4 if actionable tasks remain, otherwise 5.
   * `epic`: the current epic slug (or empty if none remain).
   * `task`: the ID of the task you just completed (or empty if none remain).
   * `detected`: true
6. Show diff for `state.yaml`. 