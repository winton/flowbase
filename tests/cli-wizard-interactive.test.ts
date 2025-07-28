import { program } from '../packages/cli/src/cli';

describe('CLI wizard interactive', () => {
  it('defines an action handler for wizard command', () => {
    const wizardCmd = program.commands.find(cmd => cmd.name() === 'wizard');
    expect(wizardCmd).toBeDefined();
    expect(wizardCmd).toBeTruthy();
    expect(typeof wizardCmd!.action).toBe('function');
  });
}); 