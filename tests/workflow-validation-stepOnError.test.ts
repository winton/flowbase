import { runWorkflow } from '../packages/core/src/workflowExecutor';
import { WorkflowDefinition } from '../packages/core/src/workflowComposition';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';

describe('WorkflowValidation step-level onError', () => {
  const registry = new FunctionRegistry();
  registry.register('ok', () => 1, [], 'number');

  it('throws when an onError handler references an undefined function', async () => {
    const wf: WorkflowDefinition = {
      id: 'wf-stepValidationOnError',
      name: 'Test validation of step-level onError',
      steps: [
        { fn: 'ok', onError: [{ fn: 'broken' }] }
      ]
    };
    await expect(runWorkflow(wf, registry)).rejects.toThrow('Undefined function: broken');
  });
}); 