import { runWorkflow } from '../packages/core/src/workflowExecutor';
import { WorkflowDefinition } from '../packages/core/src/workflowComposition';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';

describe('Step-level onError handling', () => {
  const registry = new FunctionRegistry();
  registry.register('fail', () => { throw new Error('step fail'); }, [], 'void');
  registry.register('recover', () => 'recovered', [], 'string');

  it('executes onError steps when a workflow step throws', async () => {
    const wf: WorkflowDefinition = {
      id: 'wf-stepOnError',
      name: 'Test step-level onError',
      steps: [
        { fn: 'fail', onError: [{ fn: 'recover' }] }
      ]
    };

    const results = await runWorkflow(wf, registry);
    expect(results).toEqual(['recovered']);
  });
}); 