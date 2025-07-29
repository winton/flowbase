import { program } from '../packages/cli/src/cli';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';

describe('fn:add command', () => {
  it('should register fn:add command', () => {
    expect(program.commands.find(cmd => cmd.name() === 'fn:add')).toBeDefined();
  });

  it('should load and persist function definitions from a TS file', () => {
    const tmpFilePath = path.join(os.tmpdir(), 'testFunction.ts');
    fs.writeFileSync(tmpFilePath, 'export function test() { return 1; }');
    const fnAddCmd = program.commands.find(cmd => cmd.name() === 'fn:add');
    expect(fnAddCmd).toBeDefined();
    fnAddCmd!.action!(tmpFilePath);
    const functions = new FunctionRegistry().list();
    expect(functions).toContainEqual(expect.objectContaining({ name: 'test' }));
  });
}); 