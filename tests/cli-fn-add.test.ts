import { program } from '../packages/cli/src/cli';

describe('fn:add command', () => {
  it('should register fn:add command', () => {
    expect(program.commands.find(cmd => cmd.name() === 'fn:add')).toBeDefined();
  });
}); 