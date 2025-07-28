import { bootstrapDatabase } from '../packages/db/src/index';
import { saveFunction, getFunction } from '../packages/db/src/functions';
import { saveVariable } from '../packages/db/src/variables';
import { saveWorkflow, getWorkflow } from '../packages/db/src/workflows';
import type Database from 'better-sqlite3';
import { DBVariableDefinition } from '../packages/db/src/variables';

describe('Database Error Handling', () => {
  let db: Database.Database;

  beforeAll(() => {
    db = bootstrapDatabase(':memory:');
  });

  afterAll(() => {
    db.close();
  });

  describe('Function operations error handling', () => {
    it('should handle invalid JSON in inputVars gracefully', () => {
      // This test should fail initially because there's no error handling for malformed JSON
      const malformedFunction = {
        id: 'invalid-fn',
        name: 'Invalid Function',
        description: 'Test function with invalid JSON',
        inputVars: 'invalid-json-string', // This should be a string array
        outputVars: ['string'],
        code: 'export default () => "test";'
      };

      expect(() => {
        saveFunction(db, malformedFunction as any);
      }).not.toThrow(); // Currently doesn't validate - should not throw

      // But when we try to retrieve it, JSON.parse should fail gracefully
      expect(() => {
        getFunction(db, 'invalid-fn');
      }).not.toThrow(); // This should not crash the application
    });

    it('should handle database connection errors gracefully', () => {
      // Test with a closed database
      const closedDb = bootstrapDatabase(':memory:');
      closedDb.close();

      const testFunction = {
        id: 'test-fn',
        name: 'Test Function',
        inputVars: ['string'],
        outputVars: ['string'],
        code: 'export default (x: string) => x;'
      };

      expect(() => {
        saveFunction(closedDb, testFunction);
      }).toThrow(/not open/i); // Updated to match specific SQLite closed DB error
    });
  });

  describe('Variable operations error handling', () => {
    const testVariable: DBVariableDefinition = {
      id: 'test-var',
      name: 'Test Variable',
      description: 'A variable for testing error handling',
      code: 'z.string()',
    };

    it('should handle database errors in variable operations', () => {
      const closedDb = bootstrapDatabase(':memory:');
      closedDb.close();

      expect(() => {
        saveVariable(closedDb, testVariable);
      }).toThrow(/not open/i);
    });
  });

  describe('Workflow operations error handling', () => {
    it('should handle malformed JSON in workflow steps', () => {
      // First save a workflow with valid JSON
      const workflow = {
        id: 'test-workflow',
        name: 'Test Workflow',
        steps: [{ fn: 'testFunction', args: ['test'] }]
      };

      saveWorkflow(db, workflow);

      // Now manually corrupt the JSON in the database
      const stmt = db.prepare('UPDATE workflows SET steps = ? WHERE id = ?');
      stmt.run('invalid-json', 'test-workflow');

      // Retrieving should handle the malformed JSON gracefully
      expect(() => {
        getWorkflow(db, 'test-workflow');
      }).not.toThrow(); // Should handle JSON parsing errors gracefully
      
      // Should return workflow with empty steps array
      const result = getWorkflow(db, 'test-workflow');
      expect(result?.steps).toEqual([]);
    });

    it('should handle database errors in workflow operations', () => {
      const closedDb = bootstrapDatabase(':memory:');
      closedDb.close();

      const testWorkflow = {
        id: 'test-workflow',
        name: 'Test Workflow',
        steps: []
      };

      expect(() => {
        saveWorkflow(closedDb, testWorkflow);
      }).toThrow(/not open/i);
    });
  });
}); 