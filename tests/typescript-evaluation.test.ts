import { evaluateTypeScript } from '../packages/core/src/codeEvaluator';

describe('TypeScript code evaluation', () => {
  it('returns the default export from TS code', () => {
    const fn = evaluateTypeScript<string>(
      'export default () => "hello";'
    );
    expect(fn()).toBe('hello');
  });
}); 