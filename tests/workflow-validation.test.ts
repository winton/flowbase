import { WorkflowDefinition, validateWorkflow } from '../packages/core/src/workflowComposition';
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

describe('Workflow Definition Validation', () => {
  it('passes with valid workflow and no onError', () => {
    const wfDef: WorkflowDefinition = {
      id: 'wf1',
      name: 'Test',
      steps: [{ fn: 'add', args: [1, 2] }],
    };
    const validFunctions: string[] = ['add'];
    const validVariables: string[] = [];
    expect(() => validateWorkflow(wfDef, validFunctions, validVariables)).not.toThrow();
  });

  it('throws on undefined function in onError block', () => {
    const wfDef: WorkflowDefinition = {
      id: 'wf4',
      name: 'BadOnErrorFunction',
      steps: [{ fn: 'add', args: [1, 2] }],
      onError: [{ fn: 'nonExistentFn', args: [1] }]
    };
    const validFunctions: string[] = ['add'];
    const validVariables: string[] = [];
    expect(() => validateWorkflow(wfDef, validFunctions, validVariables)).toThrow('Undefined function: nonExistentFn');
  });

  it('throws on undefined variable in onError block', () => {
    const wfDef: WorkflowDefinition = {
      id: 'wf5',
      name: 'BadOnErrorVariable',
      steps: [{ fn: 'add', args: [1, 2] }],
      onError: [{ var: 'nonExistentVar', value: 'someValue' }]
    };
    const validFunctions: string[] = ['add'];
    const validVariables: string[] = [];
    expect(() => validateWorkflow(wfDef, validFunctions, validVariables)).toThrow('Undefined variable: nonExistentVar');
  });

  it('throws on undefined function in step-level onError block', () => {
    const wfDef: WorkflowDefinition = {
      id: 'wf6',
      name: 'BadStepOnErrorFunction',
      steps: [
        { fn: 'add', args: [1, 2], onError: [{ fn: 'nonExistentFn', args: [1] }] }
      ],
    };
    const validFunctions: string[] = ['add'];
    const validVariables: string[] = [];
    expect(() => validateWorkflow(wfDef, validFunctions, validVariables)).toThrow('Undefined function: nonExistentFn');
  });

  it('throws on undefined variable in step-level onError block', () => {
    const wfDef: WorkflowDefinition = {
      id: 'wf7',
      name: 'BadStepOnErrorVariable',
      steps: [
        { var: 'myVar', value: 'test', onError: [{ var: 'nonExistentVar', value: 'someValue' }] }
      ],
    };
    const validFunctions: string[] = [];
    const validVariables: string[] = ['myVar'];
    expect(() => validateWorkflow(wfDef, validFunctions, validVariables)).toThrow('Undefined variable: nonExistentVar');
  });
});