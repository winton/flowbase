

import { runWorkflow } from '../packages/core/src/workflowExecutor';
import { WorkflowDefinition } from '../packages/core/src/workflowComposition';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';

describe('Workflow Execution', () => {
  const registry = new FunctionRegistry();
  registry.register('add', (a: number, b: number) => a + b, ['number','number'], 'number');
  registry.register('mul', (a: number, b: number) => a * b, ['number','number'], 'number');

  it('executes workflow and returns results', () => {
    const wf: WorkflowDefinition = { id: 'wf1', name: 'Test', steps: [{ fn: 'add', args: [1, 2] }] };
    const results = runWorkflow(wf, registry);
    expect(results).toEqual([3]);
  });

  it('performs type-checking before execution', () => {
    const wf: WorkflowDefinition = { id: 'wf2', name: 'Test', steps: [{ fn: 'add', args: ['a', 2] }] };
    expect(() => runWorkflow(wf, registry)).toThrowError('Argument type mismatch for function: add at position 0');
  });
}); 