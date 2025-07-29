// Flexible function implementation type that accepts various function signatures
export type FunctionImplementation<Args extends unknown[] = unknown[], Return = unknown> = (...args: Args) => Return;

export interface FunctionDefinition<Args extends unknown[] = unknown[], Return = unknown> {
  name: string;
  implementation: FunctionImplementation<Args, Return>;
  inputTypes: string[];
  outputType: string;
}

export class FunctionRegistry {
  private static _instance: FunctionRegistry;
  private functions!: Map<string, FunctionDefinition<any[], any>>;

  constructor() {
    if (FunctionRegistry._instance) {
      return FunctionRegistry._instance;
    }
    this.functions = new Map();
    FunctionRegistry._instance = this;
  }

  /**
   * Register a function along with its type metadata.
   * @param name Human-readable unique name for the function.
   * @param implementation Actual function implementation.
   * @param inputTypes Ordered list of input type names (optional).
   * @param outputType Return type name (optional).
   */
  register<Args extends unknown[] = unknown[], Return = unknown>(
    name: string,
    implementation: FunctionImplementation<Args, Return>,
    inputTypes: string[] = [],
    outputType: string = 'unknown'
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