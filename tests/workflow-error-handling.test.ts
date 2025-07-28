import { bootstrapDatabase } from '../packages/db/src/index';
import { saveWorkflow, getWorkflow } from '../packages/db/src/workflows';
import { FunctionStep } from '../packages/core/src/workflowComposition';

describe('Workflow Error Handling', () => {
  let db: any;

  beforeEach(() => {
    db = bootstrapDatabase(':memory:');
  });

  it('should save and retrieve a workflow with an onError block', () => {
    const workflowDef = {
      id: 'wf-1',
      name: 'Workflow with Error Handling',
      steps: [{ fn: 'test-func', args: [] }] as FunctionStep[],
      onError: [{ fn: 'error-handler', args: [] }] as FunctionStep[],
    };

    saveWorkflow(db, workflowDef);

    const retrieved = getWorkflow(db, 'wf-1');

    expect(retrieved).toBeDefined();
    expect(retrieved?.onError).toEqual(workflowDef.onError);
  });
}); 