import { transformSync } from 'esbuild';

export class TypeScriptEvaluationError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'TypeScriptEvaluationError';
  }
}

export function evaluateTypeScript<T>(code: string): () => T {
  try {
    // Step 1: Transform TypeScript to JavaScript
    let transformResult;
    try {
      transformResult = transformSync(code, {
        loader: 'ts',
        format: 'cjs',
      });
    } catch (error) {
      // Handle esbuild compilation errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Unexpected end of file')) {
        throw new TypeScriptEvaluationError('Syntax error: Unexpected end of file. Check for missing braces, parentheses, or quotes.', error as Error);
      } else if (errorMessage.includes('ERROR:')) {
        throw new TypeScriptEvaluationError(`TypeScript compilation failed: ${errorMessage}`, error as Error);
      } else {
        throw new TypeScriptEvaluationError(`Parse error: ${errorMessage}`, error as Error);
      }
    }

    const { code: js } = transformResult;

    // Step 2: Execute the JavaScript in a controlled environment
    const module = { exports: {} as Record<string, unknown> };
    let executionFunction;
    
    try {
      executionFunction = new Function('exports', 'module', 'require', js);
    } catch (error) {
      throw new TypeScriptEvaluationError(`Failed to create executable function: ${error instanceof Error ? error.message : String(error)}`, error as Error);
    }

    try {
      executionFunction(module.exports, module, require);
    } catch (error) {
      throw new TypeScriptEvaluationError(`Runtime error during module evaluation: ${error instanceof Error ? error.message : String(error)}`, error as Error);
    }

    // Step 3: Validate that a default export exists
    if (!module.exports.default) {
      throw new TypeScriptEvaluationError('No default export found. Please ensure your code exports a default function.');
    }

    // Step 4: If the export is a function, return it directly. Otherwise, wrap it in a function.
    if (typeof module.exports.default === 'function') {
      return module.exports.default as () => T;
    } else {
      return (() => module.exports.default) as () => T;
    }
  } catch (error) {
    // Re-throw TypeScriptEvaluationError as-is
    if (error instanceof TypeScriptEvaluationError) {
      throw error;
    }
    
    // Wrap any other unexpected errors
    throw new TypeScriptEvaluationError(`Unexpected error during TypeScript evaluation: ${error instanceof Error ? error.message : String(error)}`, error as Error);
  }
} 