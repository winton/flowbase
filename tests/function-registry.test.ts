
import { FunctionRegistry } from '../packages/core/src/FunctionRegistry';

describe('FunctionRegistry', () => {
  it('should register and retrieve a function definition by name', () => {
    const registry = new FunctionRegistry();
    const add = (a: number, b: number) => a + b;

    registry.register('add', add, ['number', 'number'], 'number');

    const retrieved = registry.get('add');
    expect(retrieved).toBeDefined();
    expect(retrieved?.implementation(2, 3)).toBe(5);
  });
}); 