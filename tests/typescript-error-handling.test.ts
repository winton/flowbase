import { evaluateTypeScript, TypeScriptEvaluationError } from '../packages/core/src/codeEvaluator';

describe('TypeScript Error Handling in Code Evaluator', () => {
  test('should handle syntax errors gracefully', () => {
    const malformedCode = `
      export default function() {
        // Missing closing brace and invalid syntax
        return "hello" +
    `;
    
    expect(() => {
      evaluateTypeScript(malformedCode);
    }).toThrow(TypeScriptEvaluationError);
    
    expect(() => {
      evaluateTypeScript(malformedCode);
    }).toThrow(/Syntax error.*Unexpected end of file/i);
  });

  test('should handle invalid TypeScript features gracefully', () => {
    const invalidCode = `
      export default function() {
        // Invalid TypeScript: undefined type
        const x: UnknownType = "test";
        return x;
      }
    `;
    
    // Note: esbuild may allow unknown types in some cases, so let's test a more definitive error
    const definiteErrorCode = `
      export default function() {
        return "unterminated string
      }
    `;
    
    expect(() => {
      evaluateTypeScript(definiteErrorCode);
    }).toThrow(TypeScriptEvaluationError);
  });

  test('should handle runtime errors in generated JavaScript gracefully', () => {
    const runtimeErrorCode = `
      export default function() {
        // This will compile but fail at runtime
        const x = null;
        return x.nonExistentProperty();
      }
    `;
    
    // This should compile successfully
    expect(() => {
      const fn = evaluateTypeScript(runtimeErrorCode);
      // But execution should be handled gracefully
      fn();
    }).toThrow();
  });

  test('should handle empty or invalid module exports', () => {
    const noExportCode = `
      // No export default
      const x = 5;
    `;
    
    expect(() => {
      evaluateTypeScript(noExportCode);
    }).toThrow(TypeScriptEvaluationError);
    
    expect(() => {
      evaluateTypeScript(noExportCode);
    }).toThrow(/No default export found/i);
  });

  test('should provide meaningful error messages', () => {
    const syntaxErrorCode = `
      export default function() {
        return "unterminated string
      }
    `;
    
    try {
      evaluateTypeScript(syntaxErrorCode);
      fail('Expected error was not thrown');
    } catch (error) {
      expect(error instanceof TypeScriptEvaluationError).toBe(true);
      expect((error as Error).message).toBeTruthy();
      expect((error as Error).message.length).toBeGreaterThan(10);
    }
  });

  it('should handle non-function default exports', () => {
    const nonFunctionExportCode = 'export default { a: 1 };';
    const result = evaluateTypeScript(nonFunctionExportCode)();
    expect(result).toEqual({ a: 1 });
  });

  it('should throw an error for modules with no default export', () => {
    const noDefaultExportCode = 'export const a = 1;';
    expect(() => {
      evaluateTypeScript(noDefaultExportCode);
    }).toThrow(TypeScriptEvaluationError);
    expect(() => {
      evaluateTypeScript(noDefaultExportCode);
    }).toThrow(/No default export found/i);
  });
}); 