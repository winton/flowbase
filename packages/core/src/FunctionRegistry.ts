// Flexible function implementation type that accepts various function signatures
export type FunctionImplementation = (...args: any[]) => any;

export interface FunctionDefinition {
  name: string;
  implementation: FunctionImplementation;
  inputTypes: string[];
  outputType: string;
}

export class FunctionRegistry {
  private functions: Map<string, FunctionDefinition>;

  constructor() {
    this.functions = new Map();
  }

  /**
   * Register a function along with its type metadata.
   * @param name Human-readable unique name for the function.
   * @param implementation Actual function implementation.
   * @param inputTypes Ordered list of input type names (optional).
   * @param outputType Return type name (optional).
   */
  register(
    name: string,
    implementation: FunctionImplementation,
    inputTypes: string[] = [],
    outputType = 'unknown'
  ): void {
    this.functions.set(name, {
      name,
      implementation,
      inputTypes,
      outputType,
    });
  }

  /**
   * Retrieve a registered function definition by name.
   */
  get(name: string): FunctionDefinition | undefined {
    return this.functions.get(name);
  }

  /**
   * List all registered function definitions.
   */
  list(): FunctionDefinition[] {
    return Array.from(this.functions.values());
  }
} 