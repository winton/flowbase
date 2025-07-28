## 🔥 Project Name

`flowbase` — Dynamic TypeScript Workflow Engine (MVP)

---

## 🎯 Goal (MVP)

* Define and store functions as code + metadata
* Define typed variables with dynamic schemas
* Compose workflows as plain JSON
* Execute workflows and trace step execution
* All text-based, local, and dev-friendly

---

## ✅ MVP Feature Set

| Feature                                       | Included |
| --------------------------------------------- | -------- |
| Load & register Zod-typed variables from DB   | ✅        |
| Store functions in DB with typed I/O metadata | ✅        |
| Compose workflows in JSON (step-by-step)      | ✅        |
| Typecheck and execute workflows               | ✅        |
| Minimal CLI for defining/running workflows    | ✅        |
| Output trace/logs from execution              | ✅        |
| AI-ready structure for later integration      | ✅        |

---

## 📁 MVP File Structure

```
flowbase/
├── packages/
│   ├── db/               # SQLite + schema loader (Prisma or better-sqlite3)
│   ├── engine/           # Function runner, validator, executor
│   ├── shared/           # Types + zod schema utils
│   └── cli/              # Basic command runner: define, run
├── workflows/
│   └── example.json      # Plain JSON workflows
├── functions/
│   └── helloWorld.ts     # Optional local authoring (syncs to DB)
├── variables.json        # Bootstrap vars (optional seed)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📦 Technologies

* **TypeScript**
* **better-sqlite3** (local, fast, typed)
* **Zod** for schema enforcement
* **ESBuild or `ts-node`** to eval TypeScript safely in dev
* **Commander** or basic `bin.ts` CLI

---

## 🗃️ Database Schema (Simplified)

```ts
// Function row
{
  id: string
  name: string
  description?: string
  inputVars: string[]   // e.g. ["Email"]
  outputVars: string[]  // e.g. ["Message"]
  code: string          // `({ email }) => ({ message: ... })`
}

// Variable row
{
  id: string
  description?: string
  code: string          // `z.string().email().brand("Email")`
}

// Workflow (as file or stored later)
{
  id: string
  name: string
  steps: {
    id: string
    fn: string           // Function ID
    inputs: Record<string, string>  // variable → value or ref
    outputs: string[]    // variables produced
  }[]
}
```

---

## 🧠 Example: Define a Function (CLI or JSON)

```json
{
  "name": "greetUser",
  "inputVars": ["UserName"],
  "outputVars": ["Greeting"],
  "code": "({ UserName }) => ({ Greeting: `Hello, ${UserName}!` })"
}
```

## 📄 Example: Define a Workflow (Text/JSON)

```json
{
  "id": "basicGreeting",
  "name": "Basic Greeting Flow",
  "steps": [
    {
      "id": "step1",
      "fn": "greetUser",
      "inputs": { "UserName": "Winton" },
      "outputs": ["Greeting"]
    }
  ]
}
```

---

## 🖥️ MVP CLI Commands

```bash
# Add a variable
flowbase var:add --id UserName --code "z.string().brand('UserName')"

# Add a function
flowbase fn:add --file ./functions/greetUser.ts

# Run a workflow
flowbase run ./workflows/basicGreeting.json
```

---

## 📦 MVP Core Packages

### `engine/`:

* `loadFunctions()` — from DB
* `loadVariables()` — compile Zod schemas
* `runWorkflow()` — execute step-by-step, resolving inputs/outputs dynamically

### `db/`:

* Minimal schema bootstrap
* Use `better-sqlite3` to avoid migrations, just seed rows

### `cli/`:

* Basic Commander-based CLI or custom parser
* Optional REPL for inline variable def/test

---

## 🚀 What You Can Do With the MVP

* Build a library of type-safe utility functions
* Chain them together using a single JSON workflow
* Dynamically validate variable types
* Output detailed traces of how values are passed between steps 