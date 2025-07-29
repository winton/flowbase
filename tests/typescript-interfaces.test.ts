import fs from 'fs';
import { listFunctions } from '../packages/db/src/functions';
import Database from 'better-sqlite3';

// Test that core interfaces are properly defined instead of using 'any'
describe('TypeScript Interface Definitions', () => {
  test('database functions should use proper interfaces instead of any', () => {
    // This test will fail until we define proper database row interfaces
    
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
      const sourceCode = fs.readFileSync('./packages/db/src/functions.ts', 'utf8');
      expect(sourceCode).not.toMatch(/row:\s*any/);
      expect(sourceCode).not.toMatch(/db:\s*any/);
    }).not.toThrow();
    
    db.close();
  });

  test('workflow steps should use proper step interfaces instead of any[]', () => {
    // This will fail until we define proper step interfaces
    expect(() => {
      const sourceCode = fs.readFileSync('./packages/core/src/workflowComposition.ts', 'utf8');
      expect(sourceCode).not.toMatch(/steps:\s*any\[\]/);
    }).not.toThrow();
  });

  test('function implementation type should use generic Args and Return', () => {
    const sourceCode = fs.readFileSync('./packages/core/src/FunctionRegistry.ts', 'utf8');
    expect(sourceCode).toMatch(/export type FunctionImplementation<Args extends unknown\[\] = unknown\[\], Return = unknown>/);
    expect(sourceCode).toMatch(/\(\.\.\.args: Args\) => Return/);
  });

  test('variable registry should use proper schema types instead of any', () => {
    // This will fail until we define proper schema interfaces
    expect(() => {
      const sourceCode = fs.readFileSync('./packages/core/src/VariableRegistry.ts', 'utf8');
      expect(sourceCode).not.toMatch(/schema:\s*any/);
    }).not.toThrow();
  });
}); 