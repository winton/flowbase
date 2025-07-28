# Step 2: Epic Outline Generation

Condition: `config/PROJECT_DESCRIPTION.md` exists, but `config/EPICS.md` is missing.

Action:
1. **Scan the repository for high-level modules:**
   * Read `config/PROJECT_DESCRIPTION.md` for context.
   * Treat top-level directories such as `src/`, `services/`, `cmd/`, or any folder with its own `README.md` as potential epics.
   * Use each directory name (or the heading in its local `README.md`) as the epic title and summarise with one-sentence description.
   * If no meaningful directories are found, fall back to AI-generated outline based on the project description.
2. Create `config/EPICS.md` with the list.
3. Update `config/state.yaml` (`current_step: 3`, clear context).
4. Show diffs/contents for `EPICS.md` and `state.yaml`.  