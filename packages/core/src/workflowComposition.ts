// Define proper step interfaces for workflows
export interface FunctionStep {
  fn: string;
  args?: unknown[];
  output?: string;
}

export interface VariableStep {
  var: string;
  value?: unknown;
  output?: string;
}

export type WorkflowStep = FunctionStep | VariableStep;

export interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
  onError?: WorkflowStep[];
}

export class WorkflowParsingError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'WorkflowParsingError';
  }
}

export function loadWorkflow(json: string): WorkflowDefinition {
  // Handle empty input
  if (!json || json.trim().length === 0) {
    throw new WorkflowParsingError('Empty JSON input: Cannot parse empty or whitespace-only string as workflow');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('Unexpected end of JSON input')) {
      throw new WorkflowParsingError('JSON parsing failed: Unexpected end of input. Check for incomplete JSON structure.', error as Error);
    } else if (errorMessage.includes('Unexpected token')) {
      throw new WorkflowParsingError(`JSON parsing failed: ${errorMessage}`, error as Error);
    } else {
      throw new WorkflowParsingError(`Invalid JSON: ${errorMessage}`, error as Error);
    }
  }

  // Handle null result
  if (parsed === null) {
    throw new WorkflowParsingError('Invalid workflow data: Workflow cannot be null');
  }

  // Validate that parsed result is an object
  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new WorkflowParsingError('Invalid workflow: Workflow must be an object, not an array or primitive value');
  }

  const workflow = parsed as Record<string, unknown>;

  // Validate required fields
  if (!workflow.id || typeof workflow.id !== 'string') {
    throw new WorkflowParsingError('Invalid workflow: Missing required field "id" (must be a string)');
  }

  if (!workflow.name || typeof workflow.name !== 'string') {
    throw new WorkflowParsingError('Invalid workflow: Missing required field "name" (must be a string)');
  }

  if (!workflow.steps || !Array.isArray(workflow.steps)) {
    throw new WorkflowParsingError('Invalid workflow: Missing required field "steps" (must be an array)');
  }

  return {
    id: workflow.id,
    name: workflow.name,
    steps: workflow.steps as WorkflowStep[]
  };
}

export function validateWorkflow(
  wf: WorkflowDefinition,
  validFunctions: string[],
  validVariables: string[]
): void {
  for (const step of wf.steps) {
    if ('fn' in step) {
      if (!validFunctions.includes(step.fn)) {
        throw new Error(`Undefined function: ${step.fn}`);
      }
    } else if ('var' in step) {
      if (!validVariables.includes(step.var)) {
        throw new Error(`Undefined variable: ${step.var}`);
      }
    }
  }
} 