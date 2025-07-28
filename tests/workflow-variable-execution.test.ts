import { runWorkflow } from '../packages/core/src/workflowExecutor';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';
import { VariableRegistry } from '../packages/core/src/VariableRegistry';

describe('Workflow Variable Step Execution', () => {
  let functionRegistry: FunctionRegistry;
  let variableRegistry: VariableRegistry;

  beforeEach(() => {
    functionRegistry = new FunctionRegistry();
    variableRegistry = new VariableRegistry();
  });

  it('should execute variable steps to set values', () => {
    // Register a variable schema
    variableRegistry.register('userName', 'z.string().min(1)', 'string');
    
    // Create a workflow with variable step
    const workflow = {
      id: 'test-workflow',
      name: 'Test Variable Workflow',
      steps: [
        { var: 'userName', value: 'John Doe' }, // Variable step to set value
      ]
    };

    // This should fail initially because variable execution is not implemented
    expect(() => {
      runWorkflow(workflow, functionRegistry, variableRegistry);
    }).not.toThrow();
  });

  it('should validate variable values against Zod schemas', () => {
    // Register a strict email variable  
    variableRegistry.register('userEmail', 'z.string().email()', 'string');
    
    const workflow = {
      id: 'test-workflow',
      name: 'Test Variable Validation',
      steps: [
        { var: 'userEmail', value: 'not-an-email' }, // Invalid email
      ]
    };

    // Should throw validation error
    expect(() => {
      runWorkflow(workflow, functionRegistry, variableRegistry);
    }).toThrow('validation failed');
  });

  it('should pass validated variable values to subsequent function steps', () => {
    // Register variable and function
    variableRegistry.register('message', 'z.string()', 'string');
    functionRegistry.register('uppercase', (...args: unknown[]) => (args[0] as string).toUpperCase(), ['string'], 'string');
    
    const workflow = {
      id: 'test-workflow',
      name: 'Test Variable to Function Flow',
      steps: [
        { var: 'message', value: 'hello world' }, // Set variable
        { fn: 'uppercase', args: ['$message'] }, // Use variable in function
      ]
    };

    const results = runWorkflow(workflow, functionRegistry, variableRegistry);
    expect(results).toEqual(['hello world', 'HELLO WORLD']);
  });

  it('should support variable references in function arguments', () => {
    // Register variables and functions
    variableRegistry.register('firstName', 'z.string()', 'string');
    variableRegistry.register('lastName', 'z.string()', 'string');
    functionRegistry.register('fullName', 
      (...args: unknown[]) => `${args[0] as string} ${args[1] as string}`,
      ['string', 'string'], 'string'
    );
    
    const workflow = {
      id: 'test-workflow',
      name: 'Test Multiple Variables',
      steps: [
        { var: 'firstName', value: 'John' },
        { var: 'lastName', value: 'Doe' },
        { fn: 'fullName', args: ['$firstName', '$lastName'] }, // Reference variables with $
      ]
    };

    const results = runWorkflow(workflow, functionRegistry, variableRegistry);
    expect(results).toEqual(['John', 'Doe', 'John Doe']);
  });
}); 