

import { program } from '../packages/cli/src/cli';

test('CLI should register workflow:import action handler', () => {
  const cmd = program.commands.find(cmd => cmd.name() === 'workflow:import');
  expect(cmd).toBeDefined();
  expect(cmd).toBeTruthy();
  expect(typeof cmd!.action).toBe('function');
}); 