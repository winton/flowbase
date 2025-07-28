

import { bootstrapDatabase } from '../packages/db/src/index';
import { saveWorkflow, getWorkflow, listWorkflows } from '../packages/db/src/workflows';

describe('Workflow persistence', () => {
  let db: any;

  beforeEach(() => {
    db = bootstrapDatabase(':memory:');
  });

  it('stores and retrieves a workflow definition', () => {
    const wfDef = {
      id: 'wf1',
      name: 'test workflow',
      steps: [{ fn: 'add', args: [1, 2] }]
    };

    saveWorkflow(db, wfDef);
    const retrieved = getWorkflow(db, 'wf1');
    expect(retrieved).toEqual(wfDef);
  });

  it('lists all stored workflows', () => {
    const wf1 = { id: 'wf1', name: 'test workflow', steps: [] };
    const wf2 = { id: 'wf2', name: 'another workflow', steps: [{ fn: 'mul', args: [2, 3] }] };

    saveWorkflow(db, wf1);
    saveWorkflow(db, wf2);
    const all = listWorkflows(db);
    expect(all).toEqual(expect.arrayContaining([wf1, wf2]));
  });
}); 