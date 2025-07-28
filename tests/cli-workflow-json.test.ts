
import { program } from '../packages/cli/src/cli';

test('CLI should register workflow import and export commands', () => {
  const commands = program.commands.map(cmd => cmd.name());
  expect(commands).toContain('workflow:import');
  expect(commands).toContain('workflow:export');
}); 