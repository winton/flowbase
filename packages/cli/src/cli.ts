import fs from 'fs';
import path from 'path';
import { bootstrapDatabase } from '../../db/src/index';
import { saveWorkflow, getWorkflow } from '../../db/src/workflows';

// Practical type for CLI command handlers that avoids 'any' but allows flexibility
type CommandHandler = Function;

class CLIProgram {
  commands: Array<{ name: () => string; description?: string; action?: CommandHandler }>;
  constructor() {
    this.commands = [];
  }
  command(name: string) {
    const cmd: { name: () => string; description?: string; action?: CommandHandler } = {
      name: () => name
    };
    this.commands.push(cmd);
    const builder = {
      description: (desc: string) => {
        cmd.description = desc;
        return builder;
      },
      action: (handler: CommandHandler) => {
        cmd.action = handler;
        return builder;
      }
    };
    return builder;
  }
}

export const program = new CLIProgram();

// Helper function to get database path at runtime
function getDbPath(): string {
  return process.env.FLOWBASE_DB_PATH || './flowbase.db';
}

program
  .command('wizard')
  .description('CLI wizard to guide users through creating their first workflow')
  .action(() => {
    console.log('🚀 Welcome to Flowbase Workflow Wizard!');
    console.log('');
    console.log('This wizard helps you create your first workflow.');
    console.log('');
    console.log('📋 Basic Workflow Structure:');
    console.log('  A workflow consists of steps that can be:');
    console.log('  • Function steps: { "fn": "functionName", "args": ["arg1", "arg2"] }');
    console.log('  • Variable steps: { "var": "variableName", "value": "someValue" }');
    console.log('');
    console.log('📁 Example workflow file (save as example.json):');
    console.log(JSON.stringify({
      id: "my-first-workflow",
      name: "My First Workflow",
      steps: [
        { var: "message", value: "Hello World" },
        { fn: "printMessage", args: ["$message"] }
      ]
    }, null, 2));
    console.log('');
    console.log('💾 Next Steps:');
    console.log('  1. Create a workflow JSON file like the example above');
    console.log('  2. Import it: flowbase workflow:import <file.json>');
    console.log('  3. Export it: flowbase workflow:export <workflow-id> <output.json>');
    console.log('');
    console.log('✨ Happy workflow building!');
  });

// Workflow JSON import/export commands
program
  .command('workflow:import')
  .description('Import a workflow from JSON file')
  .action((filePath: string) => {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found: ' + filePath);
      }

      // Read and parse JSON file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let workflowData;
      
      try {
        workflowData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error('Invalid JSON: ' + (parseError as Error).message);
      }

      // Validate required fields
      if (!workflowData.id || !workflowData.name || !workflowData.steps) {
        throw new Error('Invalid workflow: missing required fields (id, name, steps)');
      }

      // Connect to database and save workflow
      const db = bootstrapDatabase(getDbPath());
      saveWorkflow(db, workflowData);
      db.close();

      console.log(`✅ Successfully imported workflow: ${workflowData.id}`);
      console.log(`   Name: ${workflowData.name}`);
      console.log(`   Steps: ${workflowData.steps.length}`);
    } catch (error) {
      console.error('❌ Import failed:', (error as Error).message);
      throw error; // Re-throw for testing
    }
  });

program
  .command('workflow:export')
  .description('Export a workflow to JSON file')
  .action((workflowId: string, filePath: string) => {
    try {
      // Connect to database and get workflow
      const db = bootstrapDatabase(getDbPath());
      const workflow = getWorkflow(db, workflowId);
      db.close();

      if (!workflow) {
        throw new Error('Workflow not found: ' + workflowId);
      }

      // Write workflow to JSON file
      const jsonContent = JSON.stringify(workflow, null, 2);
      fs.writeFileSync(filePath, jsonContent, 'utf8');

      console.log(`✅ Successfully exported workflow: ${workflowId}`);
      console.log(`   Name: ${workflow.name}`);
      console.log(`   File: ${filePath}`);
      console.log(`   Steps: ${workflow.steps.length}`);
    } catch (error) {
      console.error('❌ Export failed:', (error as Error).message);
      throw error; // Re-throw for testing
    }
  }); 