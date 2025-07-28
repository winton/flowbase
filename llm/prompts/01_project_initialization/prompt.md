# Step 1: Project Initialization

Condition: Any of these files is missing:
* `config/PROJECT_DESCRIPTION.md`
* `config/gates.yaml`
* `config/todos.yaml`

Action:
0. **Auto-detect project stack (skip if already detected in this run):**
   * Scan the repository root for sentinel files (e.g. `package.json`, `pyproject.toml`) and infer sensible defaults for quality-gate commands:
     * `test`, `lint`, `format`, `type_check`, `security_scan`.
   * Capture the project description from the host `README.md` (first paragraph) if `PROJECT_DESCRIPTION.md` is missing.

1. If `PROJECT_DESCRIPTION.md` is still missing after detection, ask the operator for:
   a. A concise, high-level project description.  
   b. (If not obvious) the primary language / framework.
2. For each file above that is missing, create it **using the detected defaults where possible**:
   * `PROJECT_DESCRIPTION.md` – write the description.
   * `gates.yaml` – merge inferred commands with any existing keys instead of overwriting the whole file.
   * `todos.yaml` – initialise to an empty list (`[]`).
   * `scripts/run_gates.sh` – cross-shell wrapper that executes the selected gate from `gates.yaml` (created if absent, executable bit set).
3. Update `config/state.yaml` (`current_step: 2`, clear `epic_slug`, `task_id`).
4. Show diffs/contents of the files you created or changed. 