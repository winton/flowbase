

import { runWorkflow } from '../packages/core/src/workflowExecutor';
import { WorkflowDefinition } from '../packages/core/src/workflowComposition';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';

describe('Workflow Execution', () => {
  const registry = new FunctionRegistry();
  registry.register('add', (a: number, b: number) => a + b, ['number','number'], 'number');
  registry.register('mul', (a: number, b: number) => a * b, ['number','number'], 'number');

  it('executes workflow and returns results', async () => {
    const wf: WorkflowDefinition = { id: 'wf1', name: 'Test', steps: [{ fn: 'add', args: [1, 2] }] };
    const results = await runWorkflow(wf, registry);
    expect(results).toEqual([3]);
  });

  it('performs type-checking before execution', async () => {
    const wf: WorkflowDefinition = { id: 'wf2', name: 'Test', steps: [{ fn: 'add', args: ['a', 2] }] };
    await expect(runWorkflow(wf, registry)).rejects.toThrow('Argument type mismatch for function: add at position 0');
  });

  it('executes step-level onError when a step fails', async () => {
    const errorFn = () => {
      throw new Error('Step Error');
    };
    const errorHandlerFn = () => 'Handled Error';

    registry.register('errorFn', errorFn, [], 'void');
    registry.register('errorHandlerFn', errorHandlerFn, [], 'string');

    const wf: WorkflowDefinition = {
      id: 'wf3',
      name: 'Step Error Handling',
      steps: [
        { fn: 'errorFn', onError: [{ fn: 'errorHandlerFn' }] },
        { fn: 'add', args: [1, 2] } // This step should not be executed
      ]
    };
    const results = await runWorkflow(wf, registry);
    expect(results).toEqual(['Handled Error']);
  });

  it('falls back to workflow-level onError if no step-level onError', async () => {
    const errorFn = () => {
      throw new Error('Step Error');
    };
    const workflowErrorHandlerFn = () => 'Workflow Handled Error';

    registry.register('errorFn', errorFn, [], 'void');
    registry.register('workflowErrorHandlerFn', workflowErrorHandlerFn, [], 'string');

    const wf: WorkflowDefinition = {
      id: 'wf4',
      name: 'Workflow Error Handling',
      steps: [
        { fn: 'errorFn' },
        { fn: 'add', args: [1, 2] }
      ],
      onError: [{ fn: 'workflowErrorHandlerFn' }]
    };
    const results = await runWorkflow(wf, registry);
    expect(results).toEqual(['Workflow Handled Error']);
  });

  it('throws if no onError handler is defined', async () => {
    const errorFn = () => {
      throw new Error('Step Error');
    };

    registry.register('errorFn', errorFn, [], 'void');

    const wf: WorkflowDefinition = {
      id: 'wf5',
      name: 'No Error Handling',
      steps: [
        { fn: 'errorFn' },
        { fn: 'add', args: [1, 2] }
      ]
    };
    await expect(runWorkflow(wf, registry)).rejects.toThrow('Step Error');
  });

  it('retries a failing step with a configurable delay', async () => {
    jest.useFakeTimers();

    let attempts = 0;
    const flakyFn = () => {
      attempts++;
      if (attempts < 3) {
        throw new Error(`Flaky error attempt ${attempts}`);
      }
      return 'Success';
    };

    registry.register('flakyFn', flakyFn, [], 'string');

    const wf: WorkflowDefinition = {
      id: 'wf6',
      name: 'Retry Test',
      steps: [
        { fn: 'flakyFn', retry: { maxAttempts: 3, delay: 10 } },
      ]
    };

    const promise = runWorkflow(wf, registry);

    await jest.advanceTimersByTimeAsync(10);
    await jest.advanceTimersByTimeAsync(10);

    const results = await promise;
    expect(results).toEqual(['Success']);
    expect(attempts).toBe(3);

    jest.useRealTimers();
  });

  it('retries a failing step with exponential backoff', async () => {
    jest.useFakeTimers();

    let attempts = 0;
    const flakyFn = () => {
      attempts++;
      if (attempts < 3) {
        throw new Error(`Flaky error attempt ${attempts}`);
      }
      return 'Success';
    };

    registry.register('flakyFn', flakyFn, [], 'string');

    const wf: WorkflowDefinition = {
      id: 'wf7',
      name: 'Exponential Backoff Test',
      steps: [
        { fn: 'flakyFn', retry: { maxAttempts: 3, delay: 10, backoffFactor: 2 } },
      ]
    };

    const promise = runWorkflow(wf, registry);

    await jest.advanceTimersByTimeAsync(10); // First retry: 10ms
    await jest.advanceTimersByTimeAsync(20); // Second retry: 10ms * 2 = 20ms

    const results = await promise;
    expect(results).toEqual(['Success']);
    expect(attempts).toBe(3);

    jest.useRealTimers();
  });
}); 