import { WorkflowDefinition } from './workflowComposition';
import { FunctionRegistry } from './FunctionRegistry';

export function validateWorkflowTypes(
  wf: WorkflowDefinition,
  registry: FunctionRegistry
): void {
  const allSteps = [...wf.steps, ...(wf.onError ?? [])];
  for (const step of allSteps) {
    if ('fn' in step) {
      const fnDef = registry.get(step.fn);
      if (!fnDef) {
        throw new Error(`Undefined function: ${step.fn}`);
      }
      const expectedTypes = fnDef.inputTypes;
      const args = step.args ?? [];
      if (args.length !== expectedTypes.length) {
        throw new Error(`Argument count mismatch for function: ${step.fn}`);
      }
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const expectedType = expectedTypes[i];
        if (typeof arg !== expectedType) {
          throw new Error(`Argument type mismatch for function: ${step.fn} at position ${i}`);
        }
      }
    }
  }
} 