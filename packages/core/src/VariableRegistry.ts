import { z } from 'zod';
import { evaluateTypeScript } from './codeEvaluator';

export interface VariableDefinition {
  name: string;
  schema: z.ZodSchema<unknown>; // Proper Zod schema type instead of any
  zodCode: string; // Original Zod code string
  type: string;
}

export class VariableRegistry {
  private variables: Map<string, VariableDefinition>;
  private values: Map<string, unknown>; // Store variable values during execution

  constructor() {
    this.variables = new Map();
    this.values = new Map();
  }

  /**
   * Register a variable with its Zod schema.
   * @param name Variable name
   * @param zodCode Zod schema code (e.g., "z.string().email()")
   * @param type TypeScript type name
   */
  register(name: string, zodCode: string, type: string): void {
    try {
      const codeToEvaluate = `
        import { z } from 'zod';
        export default ${zodCode};
      `;
      
      const schema = evaluateTypeScript<z.ZodSchema<unknown>>(codeToEvaluate)();
      
      this.variables.set(name, {
        name,
        schema,
        zodCode,
        type,
      });
    } catch (error) {
      throw new Error(`Failed to register variable ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a variable definition by name.
   */
  get(name: string): VariableDefinition | undefined {
    return this.variables.get(name);
  }

  /**
   * Set a variable value with validation.
   */
  setValue(name: string, value: unknown): void {
    const varDef = this.variables.get(name);
    if (!varDef) {
      throw new Error(`Variable ${name} is not registered`);
    }

    try {
      // Validate the value against the Zod schema
      const validatedValue = varDef.schema.parse(value);
      this.values.set(name, validatedValue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue: { message: string; }) => issue.message).join(', ');
        throw new Error(`Variable ${name} validation failed: ${errorMessages}`);
      }
      throw new Error(`Variable ${name} validation failed: ${error instanceof Error ? error.message : 'Invalid value'}`);
    }
  }

  /**
   * Get a variable value.
   */
  getValue(name: string): unknown {
    if (!this.values.has(name)) {
      throw new Error(`Variable ${name} has no value set`);
    }
    return this.values.get(name);
  }

  /**
   * Check if a variable has a value set.
   */
  hasValue(name: string): boolean {
    return this.values.has(name);
  }

  /**
   * List all registered variables.
   */
  list(): VariableDefinition[] {
    return Array.from(this.variables.values());
  }

  /**
   * Clear all variable values (useful for test cleanup).
   */
  clearValues(): void {
    this.values.clear();
  }
} 