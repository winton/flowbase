import { existsSync, readFileSync } from 'fs';
import rootPkg from '../package.json';
const readme = readFileSync('README.md', 'utf-8');

describe('Developer setup script', () => {
  it('defines a setup script in package.json', () => {
    expect(rootPkg.scripts.setup).toBe('bash scripts/setup.sh');
  });

  it('includes the setup script file', () => {
    expect(existsSync('scripts/setup.sh')).toBe(true);
  });

  it('documents setup instructions in README', () => {
    expect(readme).toMatch(/bash scripts\/setup\.sh/);
  });
}); 