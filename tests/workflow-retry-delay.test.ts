import { runWorkflow } from '../packages/core/src/workflowExecutor';
import { WorkflowDefinition } from '../packages/core/src/workflowComposition';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';

describe('Step-level retry delays', () => {
  let callCount = 0;
  const registry = new FunctionRegistry();
  registry.register('flaky', () => {
    callCount++;
    if (callCount < 3) {
      throw new Error('fail');
    }
    return 'ok';
  }, [], 'string');

  it('applies configurable delay and backoff between retries', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((cb, _timeout) => {
      cb();
      return 0 as unknown as NodeJS.Timeout;
    });
    const wf: WorkflowDefinition = {
      id: 'wf-stepRetryDelay',
      name: 'Test retry delay with backoff',
      steps: [
        { fn: 'flaky', retry: { maxAttempts: 3, delay: 100, backoffFactor: 2 } }
      ]
    };

    const results = await runWorkflow(wf, registry);

    expect(results).toEqual(['ok']);
    expect(callCount).toBe(3);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(2);
    expect(setTimeoutSpy).toHaveBeenNthCalledWith(1, expect.any(Function), 100);
    expect(setTimeoutSpy).toHaveBeenNthCalledWith(2, expect.any(Function), 200);

    setTimeoutSpy.mockRestore();
  });
}); 