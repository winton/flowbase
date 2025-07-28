

import { loadWorkflow, validateWorkflow } from '../packages/core/src/workflowComposition';

describe('Workflow Composition API', () => {
  it('parses a JSON-encoded workflow definition', () => {
    const json = JSON.stringify({ id: 'wf1', name: 'Test WF', steps: [{ fn: 'add', args: [1, 2] }] });
    const wf = loadWorkflow(json);
    expect(wf).toEqual({ id: 'wf1', name: 'Test WF', steps: [{ fn: 'add', args: [1, 2] }] });
  });

  it('throws on invalid JSON', () => {
    expect(() => loadWorkflow('not-json')).toThrow();
  });

  it('validates references successfully when definitions exist', () => {
    const wf = { id: 'wf1', name: 'Test WF', steps: [{ fn: 'add', args: [1, 2] }, { var: 'x' }] };
    expect(() => validateWorkflow(wf, ['add'], ['x'])).not.toThrow();
  });

  it('throws on missing function reference', () => {
    const wf = { id: 'wf1', name: 'Test WF', steps: [{ fn: 'foo', args: [] }] };
    expect(() => validateWorkflow(wf, ['add'], ['x'])).toThrow('Undefined function: foo');
  });

  it('throws on missing variable reference', () => {
    const wf = { id: 'wf1', name: 'Test WF', steps: [{ var: 'y' }] };
    expect(() => validateWorkflow(wf, ['add'], ['x'])).toThrow('Undefined variable: y');
  });
}); 