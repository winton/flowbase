import { runWorkflow } from '../packages/core/src/workflowExecutor';
import { WorkflowDefinition } from '../packages/core/src/workflowComposition';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';

describe('Step-level onError prioritization', () => {
  let callCount = 0;
  const registry = new FunctionRegistry();
  registry.register('fail', () => { callCount++; throw new Error('err'); }, [], 'void');
  registry.register('recover', () => 'ok', [], 'string');

  it('invokes onError immediately without retry when onError is defined', async () => {
    const wf: WorkflowDefinition = {
      id: 'wf-prioritize-onError',
      name: 'Test step-level onError prioritization',
      steps: [
        { fn: 'fail', retry: { maxAttempts: 3 }, onError: [{ fn: 'recover' }] }
      ]
    };

    const results = await runWorkflow(wf, registry);
    expect(results).toEqual(['ok']);
    expect(callCount).toBe(1);
  });
}); 