import fs from 'fs';
import { program } from '../packages/cli/src/cli';
import { bootstrapDatabase } from '../packages/db/src/index';
import { saveWorkflow } from '../packages/db/src/workflows';

describe('CLI Command Integration', () => {
  const testDbPath = '/tmp/test-flowbase.db';
  const testWorkflowPath = '/tmp/test-workflow.json';
  
  beforeEach(() => {
    // Clean up any existing test files
    if (fs.existsSync(testWorkflowPath)) {
      fs.unlinkSync(testWorkflowPath);
    }
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    
    // Set environment variable for CLI commands to use test database
    process.env.FLOWBASE_DB_PATH = testDbPath;
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testWorkflowPath)) {
      fs.unlinkSync(testWorkflowPath);
    }
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    
    // Reset environment variable
    delete process.env.FLOWBASE_DB_PATH;
  });

  describe('workflow:import command', () => {
    it('should import a workflow from JSON file to database', async () => {
      // Create test workflow JSON file
      const testWorkflow = {
        id: 'test-workflow',
        name: 'Test Workflow',
        steps: [
          { fn: 'testFunction', args: ['test'] }
        ]
      };
      
      fs.writeFileSync(testWorkflowPath, JSON.stringify(testWorkflow, null, 2));
      
      // Get the import command
      const importCmd = program.commands.find(cmd => cmd.name() === 'workflow:import');
      expect(importCmd).toBeDefined();
      expect(importCmd!.action).toBeDefined();
      
      // This should fail initially because real import logic is not implemented
      expect(() => {
        importCmd!.action!(testWorkflowPath);
      }).not.toThrow();
    });

    it('should handle missing file gracefully', () => {
      const importCmd = program.commands.find(cmd => cmd.name() === 'workflow:import');
      
      expect(() => {
        importCmd!.action!('/nonexistent/file.json');
      }).toThrow('File not found');
    });

    it('should handle invalid JSON gracefully', () => {
      // Create invalid JSON file
      fs.writeFileSync(testWorkflowPath, 'invalid json content');
      
      const importCmd = program.commands.find(cmd => cmd.name() === 'workflow:import');
      
      expect(() => {
        importCmd!.action!(testWorkflowPath);
      }).toThrow('Invalid JSON');
    });
  });

  describe('workflow:export command', () => {
    it('should export a workflow from database to JSON file', () => {
      // Setup: Save a workflow to database first using the same DB path
      const db = bootstrapDatabase(testDbPath);
      const testWorkflow = {
        id: 'export-test',
        name: 'Export Test Workflow',
        steps: [{ fn: 'testFn', args: ['arg1'] }]
      };
      
      saveWorkflow(db, testWorkflow);
      db.close();
      
      // Get the export command
      const exportCmd = program.commands.find(cmd => cmd.name() === 'workflow:export');
      expect(exportCmd).toBeDefined();
      expect(exportCmd!.action).toBeDefined();
      
      // This should succeed now that we're using the same database
      expect(() => {
        exportCmd!.action!('export-test', testWorkflowPath);
      }).not.toThrow();
      
      // Should create the file
      expect(fs.existsSync(testWorkflowPath)).toBe(true);
      
      // Should contain valid JSON
      const exportedContent = JSON.parse(fs.readFileSync(testWorkflowPath, 'utf8'));
      expect(exportedContent.id).toBe('export-test');
      expect(exportedContent.name).toBe('Export Test Workflow');
    });

    it('should handle missing workflow gracefully', () => {
      const exportCmd = program.commands.find(cmd => cmd.name() === 'workflow:export');
      
      expect(() => {
        exportCmd!.action!('nonexistent-workflow', testWorkflowPath);
      }).toThrow(/Workflow with id/);
    });
  });

  describe('wizard command', () => {
    it('should provide interactive workflow creation', () => {
      const wizardCmd = program.commands.find(cmd => cmd.name() === 'wizard');
      expect(wizardCmd).toBeDefined();
      expect(wizardCmd!.action).toBeDefined();
      
      // Mock console methods for testing
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args: any[]) => {
        logs.push(args.join(' '));
      };
      
      try {
        // This should fail initially because real wizard logic is not implemented
        expect(() => {
          wizardCmd!.action!();
        }).not.toThrow();
        
        // Should output some guidance
        expect(logs.length).toBeGreaterThan(0);
        expect(logs.some(log => log.includes('workflow'))).toBe(true);
      } finally {
        console.log = originalLog;
      }
    });
  });
}); 