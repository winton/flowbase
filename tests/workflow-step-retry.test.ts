import { runWorkflow } from '../packages/core/src/workflowExecutor';
import { WorkflowDefinition } from '../packages/core/src/workflowComposition';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';

describe('Step-level retry handling', () => {
  let callCount = 0;
  const registry = new FunctionRegistry();
  registry.register('flaky', () => {
    callCount++;
    if (callCount < 3) {
      throw new Error('fail');
    }
    return 'ok';
  }, [], 'string');

  it('retries a step until success based on retry.maxAttempts', async () => {
    const wf: WorkflowDefinition = {
      id: 'wf-stepRetry',
      name: 'Test step-level retry',
      steps: [
        { fn: 'flaky', retry: { maxAttempts: 3 } }
      ]
    };

    const results = await runWorkflow(wf, registry);
    expect(results).toEqual(['ok']);
    expect(callCount).toBe(3);
  });
}); 