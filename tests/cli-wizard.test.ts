import { program } from '../packages/cli/src/cli';

test('CLI wizard command should be registered', () => {
  const commands = program.commands.map(cmd => cmd.name());
  expect(commands).toContain('wizard');
}); 