import { runWorkflow } from '../packages/core/src/workflowExecutor';
import { WorkflowDefinition } from '../packages/core/src/workflowComposition';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';

describe('Workflow-level onError handling', () => {
  const registry = new FunctionRegistry();
  registry.register('fail', () => { throw new Error('boom'); }, [], 'void');
  registry.register('handle', () => 'handled', [], 'string');

  it('executes onError steps when a workflow step throws', () => {
    const wf: WorkflowDefinition = {
      id: 'wf-onError',
      name: 'Test onError',
      steps: [ { fn: 'fail' } ],
      onError: [ { fn: 'handle' } ]
    } as any;

    const results = runWorkflow(wf, registry);
    expect(results).toEqual(['handled']);
  });
}); 