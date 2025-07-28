# llm

This directory was **copied from** [github.com/winton/llm-starter](https://github.com/winton/llm-starter) and serves as a language-agnostic framework for building software projects with Large Language Model (LLM) tool-use IDEs such as Cursor.

**You are now inside your project**. Follow the workflow below to let the LLM drive documentation, backlog creation, and implementation.

---

## Workflow

This project uses a single, powerful prompt to drive development.

1.  **Add the `llm/` directory to your chat context.**
    This provides the AI with the core prompt, configuration, and backlog.
2.  **Run the master prompt (`llm/prompts/prompt.md`).**
    The AI reads `llm/config/state.yaml` to jump straight to the active step, saving tokens. It then executes the corresponding step prompt. Outcomes can include:
    *   Asking you setup questions if the project is new.
    *   Generating a high-level feature plan (`llm/config/EPICS.md`).
    *   Seeding the backlog (`llm/config/todos.yaml`) with new tasks.
    *   Implementing a feature via test-driven development.
    *   Running maintenance tasks.
3.  **Repeat.**
    Continue running the same prompt. The AI will incrementally build the project, feature by feature.

---

## Files & Directories

The framework will create and manage the following files for you:

```
llm/config/gates.yaml       – quality gate commands
llm/config/state.yaml       – tiny state file (current step and optional epic/task context)
llm/config/todos.yaml       – engineering backlog, structured YAML
llm/config/PROJECT_DESCRIPTION.md – high-level project plan
llm/config/EPICS.md         – high-level feature list
llm/config/epics/
  <epic_slug>/
    outline.md              – just-in-time docs for one epic
llm/config/knowledge/
  SYSTEM_OVERVIEW.md        - high-level architecture docs
tests/                      – test code, added incrementally
llm/config/REVIEW_REQUESTED.md - created when the LLM needs human help
```

---

## Philosophy

*   **Radical Simplicity**: One prompt to rule them all. No complex scripts or commands.
*   **Autonomous & Stateful**: The AI knows what to do next based on the project's state.
*   **Agile, Vertical Slices**: Deliver complete, tested features one at a time.
*   **Write before you code**: Just-in-time docs for each feature prevent rework.
*   **Red-Green-Refactor**: Failing tests are written before code, ensuring continuous verification.