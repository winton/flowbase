import { WorkflowDefinition } from './workflowComposition';
import { FunctionRegistry, FunctionImplementation } from './FunctionRegistry';
import { VariableRegistry } from './VariableRegistry';
import { validateWorkflowTypes } from './workflowValidation';

export async function runWorkflow(
  wf: WorkflowDefinition,
  registry: FunctionRegistry,
  variableRegistry?: VariableRegistry
): Promise<unknown[]> {
  // Perform type validation
  validateWorkflowTypes(wf, registry);

  const results: unknown[] = [];

  const executeSteps = async (steps: typeof wf.steps): Promise<unknown[]> => {
    const localResults: unknown[] = [];
    for (const step of steps) {
      let attempts = 0;
      // let success = false; // Not needed, determined by successful completion of try block or onError handling
      // let stepResults: unknown[] = []; // Not needed, push directly to localResults or return early

      while (attempts < (step.retry?.maxAttempts ?? 1)) {
        attempts++;
        try {
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
          break; // Exit retry loop on success
        } catch (error) {
          if (step.onError && step.onError.length) {
            // Prioritize step-level onError: execute and return immediately.
            return await executeSteps(step.onError);
          } else if (attempts < (step.retry?.maxAttempts ?? 1)) {
            const delay = (step.retry?.delay ?? 0) * Math.pow(step.retry?.backoffFactor ?? 1, attempts - 1);
            await new Promise(resolve => global.setTimeout(resolve, delay)); // Wait for delay
          } else {
            throw error; // Re-throw if no more retries and no onError
          }
        }
      }
    }
    return localResults;
  };

  try {
    results.push(...(await executeSteps(wf.steps)));
    return results;
  } catch (error) {
    if (wf.onError && wf.onError.length) {
      return await executeSteps(wf.onError);
    }
    throw error;
  }
} 