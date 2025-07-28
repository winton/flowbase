# Step 2: Epic Outline Generation

Condition: `config/PROJECT_DESCRIPTION.md` exists, but `config/EPICS.md` is missing.

Action:
1. **Generate high-level feature epics based on the project description and code scan:**
   * Read `config/PROJECT_DESCRIPTION.md` thoroughly to understand the core functionality and explicit features.
   * Perform a comprehensive scan of the entire repository. Look for existing modules (e.g., `src/`, `services/`, `cmd/`, or any folder with its own `README.md`), but also identify any implicit features or components mentioned in the `PROJECT_DESCRIPTION.md` or evident from file names and content.
   * For each identified feature or module, create an epic title (using a directory name, `README.md` heading, or a descriptive name derived from the `PROJECT_DESCRIPTION.md` or code) and a one-sentence summary.
   * Ensure all key features outlined in `PROJECT_DESCRIPTION.md` are represented as epics.
2. Create `config/EPICS.md` with the list.
3. Update `config/state.yaml` (`current_step: 3`, clear context).
4. Show diffs/contents for `EPICS.md` and `state.yaml`.  