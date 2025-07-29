import { program } from '../packages/cli/src/cli';

describe('var:add command', () => {
  it('should register var:add command', () => {
    expect(program.commands.find(cmd => cmd.name() === 'var:add')).toBeDefined();
  });
}); 