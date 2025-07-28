/// <reference types="jest" />

import { describe, it, expect } from '@jest/globals';

import { bootstrapDatabase } from '../packages/db/src/index';

describe('bootstrapDatabase', () => {
  it('creates functions, variables, and workflows tables', () => {
    const db = bootstrapDatabase(':memory:');
    const rows = db.prepare("SELECT name FROM sqlite_schema WHERE type='table'").all();
    const tableNames = rows.map((r: any) => r.name);
    expect(tableNames).toEqual(
      expect.arrayContaining(['functions', 'variables', 'workflows'])
    );
    db.close();
  });
}); 