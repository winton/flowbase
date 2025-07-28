

import { program } from '../packages/cli/src/cli';

test('CLI should register workflow:export action handler', () => {
  const cmd = program.commands.find(cmd => cmd.name() === 'workflow:export');
  expect(cmd).toBeDefined();
  expect(cmd).toBeTruthy();
  expect(typeof cmd!.action).toBe('function');
}); 