import { z } from 'zod';

// Test that core interfaces are properly defined instead of using 'any'
describe('TypeScript Interface Definitions', () => {
  test('database functions should use proper interfaces instead of any', () => {
    // This test will fail until we define proper database row interfaces
    const { listFunctions } = require('../packages/db/src/functions');
    const Database = require('better-sqlite3');
    
    // Create in-memory database for testing
    const db = new Database(':memory:');
    db.exec(`
      CREATE TABLE functions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        inputVars TEXT NOT NULL,
        outputVars TEXT NOT NULL,
        code TEXT NOT NULL
      )
    `);
    
    // Insert test data
    db.prepare(`
      INSERT INTO functions (id, name, description, inputVars, outputVars, code)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('test-fn', 'Test Function', 'A test', '["input"]', '["output"]', 'return input;');
    
    // This should work with proper typing (will fail with current 'any' usage)
    const functions = listFunctions(db);
    expect(functions).toHaveLength(1);
    expect(functions[0]).toHaveProperty('id', 'test-fn');
    
    // Test that the implementation doesn't rely on 'any' types
    // This assertion will fail until proper interfaces are implemented
    expect(() => {
      const sourceCode = require('fs').readFileSync('./packages/db/src/functions.ts', 'utf8');
      expect(sourceCode).not.toMatch(/row:\s*any/);
      expect(sourceCode).not.toMatch(/db:\s*any/);
    }).not.toThrow();
    
    db.close();
  });

  test('workflow steps should use proper step interfaces instead of any[]', () => {
    const { WorkflowDefinition } = require('../packages/core/src/workflowComposition');
    
    // This will fail until we define proper step interfaces
    expect(() => {
      const sourceCode = require('fs').readFileSync('./packages/core/src/workflowComposition.ts', 'utf8');
      expect(sourceCode).not.toMatch(/steps:\s*any\[\]/);
    }).not.toThrow();
  });

  test('function implementations should use proper generic types instead of any', () => {
    const { FunctionRegistry } = require('../packages/core/src/FunctionRegistry');
    
    // This will fail until we use proper generic function types
    expect(() => {
      const sourceCode = require('fs').readFileSync('./packages/core/src/FunctionRegistry.ts', 'utf8');
      expect(sourceCode).not.toMatch(/args:\s*any\[\]/);
      expect(sourceCode).not.toMatch(/=>\s*any/);
    }).not.toThrow();
  });

  test('variable registry should use proper schema types instead of any', () => {
    const { VariableRegistry } = require('../packages/core/src/VariableRegistry');
    
    // This will fail until we define proper schema interfaces
    expect(() => {
      const sourceCode = require('fs').readFileSync('./packages/core/src/VariableRegistry.ts', 'utf8');
      expect(sourceCode).not.toMatch(/schema:\s*any/);
    }).not.toThrow();
  });
}); 