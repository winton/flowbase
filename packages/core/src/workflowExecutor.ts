import { WorkflowDefinition } from './workflowComposition';
import { FunctionRegistry, FunctionImplementation } from './FunctionRegistry';
import { VariableRegistry } from './VariableRegistry';
import { validateWorkflowTypes } from './workflowValidation';

export function runWorkflow(
  wf: WorkflowDefinition,
  registry: FunctionRegistry,
  variableRegistry?: VariableRegistry
): unknown[] {
  // Perform type validation
  validateWorkflowTypes(wf, registry);

  const results: unknown[] = [];

  const executeSteps = (steps: typeof wf.steps): unknown[] => {
    const localResults: unknown[] = [];
    for (const step of steps) {
      if ('fn' in step) {
        const fnDef = registry.get(step.fn);
        const resolvedArgs = step.args?.map((arg: unknown) => {
          if (typeof arg === 'string' && arg.startsWith('$') && variableRegistry) {
            const varName = arg.slice(1);
            return variableRegistry.getValue(varName);
          }
          return arg;
        }) || [];
        const output = (fnDef!.implementation as FunctionImplementation)(...resolvedArgs);
        localResults.push(output);
      } else if ('var' in step) {
        if (!variableRegistry) {
          throw new Error('Variable registry is required for variable steps');
        }
        if ('value' in step) {
          variableRegistry.setValue(step.var, step.value);
          localResults.push(step.value);
        } else {
          throw new Error(`Variable step for ${step.var} must have a 'value' property`);
        }
      }
    }
    return localResults;
  };

  try {
    results.push(...executeSteps(wf.steps));
    return results;
  } catch (error) {
    if (wf.onError && wf.onError.length) {
      return executeSteps(wf.onError);
    }
    throw error;
  }
} 