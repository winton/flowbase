# Developer Experience & Tooling: TypeScript Code Evaluation

This outline describes the steps to implement on-the-fly TypeScript evaluation using esbuild:

- Introduce `evaluateTypeScript` function in `packages/core/src/codeEvaluator.ts` to transpile TypeScript code into JavaScript via esbuild.
- Load and execute the transpiled code, returning the default export to the caller.
- Ensure the evaluator is asynchronous and returns typed results.
- Plan for sandboxing or isolation to prevent unintended side effects. 