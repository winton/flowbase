const { existsSync } = require('fs');
const rootPkg = require('../package.json');

describe('Monorepo and CI setup', () => {
  it('defines workspaces in package.json', () => {
    expect(Array.isArray(rootPkg.workspaces)).toBe(true);
    expect(rootPkg.workspaces).toContain('packages/*');
  });

  it('includes GitHub Actions CI workflow', () => {
    expect(existsSync('.github/workflows/ci.yaml')).toBe(true);
  });
}); 