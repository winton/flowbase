import { loadWorkflow, WorkflowParsingError } from '../packages/core/src/workflowComposition';
import { getWorkflow, listWorkflows } from '../packages/db/src/workflows';
import { bootstrapDatabase } from '../packages/db/src/index';

describe('Workflow JSON Parsing Error Handling', () => {
  test('loadWorkflow should handle malformed JSON gracefully', () => {
    const malformedJson = '{ "id": "test", "name": "Test", "steps": [}';
    
    expect(() => {
      loadWorkflow(malformedJson);
    }).toThrow(WorkflowParsingError);
    
    expect(() => {
      loadWorkflow(malformedJson);
    }).toThrow(/JSON parsing failed/i);
    
    // Should provide meaningful error message
    try {
      loadWorkflow(malformedJson);
      fail('Expected error was not thrown');
    } catch (error) {
      expect(error instanceof WorkflowParsingError).toBe(true);
      expect((error as Error).message).toContain('JSON');
    }
  });

  test('loadWorkflow should handle completely invalid JSON', () => {
    const invalidJson = 'this is not json at all';
    
    expect(() => {
      loadWorkflow(invalidJson);
    }).toThrow(WorkflowParsingError);
    
    expect(() => {
      loadWorkflow(invalidJson);
    }).toThrow(/JSON parsing failed/i);
  });

  test('loadWorkflow should handle empty or null input', () => {
    expect(() => {
      loadWorkflow('');
    }).toThrow(WorkflowParsingError);
    
    expect(() => {
      loadWorkflow('');
    }).toThrow(/Empty JSON input/i);
    
    expect(() => {
      loadWorkflow('null');
    }).toThrow(WorkflowParsingError);
    
    expect(() => {
      loadWorkflow('null');
    }).toThrow(/Workflow cannot be null/i);
  });

  test('loadWorkflow should validate workflow structure after parsing', () => {
    // Valid JSON but invalid workflow structure
    const invalidWorkflow = '{"invalid": "structure"}';
    
    expect(() => {
      loadWorkflow(invalidWorkflow);
    }).toThrow(WorkflowParsingError);
    
    expect(() => {
      loadWorkflow(invalidWorkflow);
    }).toThrow(/Missing required field/i);
  });

  test('database workflow functions should handle JSON parse errors robustly', () => {
    const db = bootstrapDatabase(':memory:');
    
    // Create a workflow with intentionally malformed JSON in steps
    const malformedStepsQuery = `
      INSERT INTO workflows (id, name, steps) 
      VALUES ('test-workflow', 'Test Workflow', '{"invalid": json}')
    `;
    
    // This should not crash the database
    db.prepare(malformedStepsQuery).run();
    
    // getWorkflow should handle the malformed JSON gracefully
    expect(() => {
      const result = getWorkflow(db, 'test-workflow');
      expect(result).toBeDefined();
      expect(result?.steps).toEqual([]);  // Should fallback to empty array
    }).not.toThrow();
    
    // listWorkflows should also handle malformed JSON gracefully
    expect(() => {
      const results = listWorkflows(db);
      expect(results).toHaveLength(1);
      expect(results[0].steps).toEqual([]);  // Should fallback to empty array
    }).not.toThrow();
    
    db.close();
  });

  test('workflow functions should provide detailed error information', () => {
    // Test that error messages are informative
    const malformedJson = '{ "id": "test", "name": "Test", "steps": [invalid}';
    
    try {
      loadWorkflow(malformedJson);
      fail('Expected error was not thrown');
    } catch (error) {
      expect(error instanceof WorkflowParsingError).toBe(true);
      const message = (error as Error).message;
      expect(message.length).toBeGreaterThan(20);  // Should be descriptive
      expect(message).toMatch(/JSON|parse|syntax/i);  // Should mention the issue
    }
  });
}); 