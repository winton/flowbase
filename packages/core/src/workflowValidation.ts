import { WorkflowDefinition } from './workflowComposition';
import { FunctionRegistry } from './FunctionRegistry';
import { WorkflowStep } from './workflowComposition';

export function validateWorkflowTypes(
  wf: WorkflowDefinition,
  registry: FunctionRegistry
): void {
  // Recursively validate main steps and any onError handlers
  const queue: WorkflowStep[] = [...wf.steps, ...(wf.onError ?? [])];
  while (queue.length > 0) {
    const step = queue.shift()!;
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
    } else if ('var' in step) {
      // No type validation for var steps, as their value is dynamic
    }
    if (step.onError && step.onError.length > 0) {
      queue.push(...step.onError);
    }
  }
} 