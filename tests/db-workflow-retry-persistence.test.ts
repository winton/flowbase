import { bootstrapDatabase } from '../packages/db/src/index';
import { saveWorkflow, getWorkflow } from '../packages/db/src/workflows';

describe('DBWorkflowDefinition retry settings persistence', () => {
  let db: ReturnType<typeof bootstrapDatabase>;
  beforeEach(() => {
    db = bootstrapDatabase(':memory:');
  });

  it('persists retry settings when saving and retrieving a workflow', () => {
    const wfDef = {
      id: 'wf-dbRetry',
      name: 'Test DB retry persistence',
      steps: [
        { fn: 'testFn', retry: { maxAttempts: 2, delay: 100, backoffFactor: 3 } }
      ]
    };
    saveWorkflow(db, wfDef);
    const retrieved = getWorkflow(db, 'wf-dbRetry');
    expect(retrieved.steps[0].retry).toEqual({ maxAttempts: 2, delay: 100, backoffFactor: 3 });
  });
}); 