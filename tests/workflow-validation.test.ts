

import { WorkflowDefinition } from '../packages/core/src/workflowComposition';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';
import { validateWorkflowTypes } from '../packages/core/src/workflowValidation';

describe('Workflow Type Validation', () => {
  const registry = new FunctionRegistry();
  registry.register('add', (a: number, b: number) => a + b, ['number','number'], 'number');
  registry.register('mul', (a: number, b: number) => a * b, ['number','number'], 'number');

  it('passes when args match input types', () => {
    const wfDef: WorkflowDefinition = { id: 'wf1', name: 'Test', steps: [{ fn: 'add', args: [1, 2] }, { fn: 'mul', args: [3, 4] }] };
    expect(() => validateWorkflowTypes(wfDef, registry)).not.toThrow();
  });

  it('throws on argument count mismatch', () => {
    const wfDef: WorkflowDefinition = { id: 'wf2', name: 'BadCount', steps: [{ fn: 'add', args: [1] }] };
    expect(() => validateWorkflowTypes(wfDef, registry)).toThrow('Argument count mismatch for function: add');
  });

  it('throws on argument type mismatch', () => {
    const wfDef: WorkflowDefinition = { id: 'wf3', name: 'BadType', steps: [{ fn: 'add', args: ['a', 2] }] };
    expect(() => validateWorkflowTypes(wfDef, registry)).toThrow('Argument type mismatch for function: add at position 0');
  });
}); 