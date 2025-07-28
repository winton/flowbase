/// <reference types="jest" />

import { bootstrapDatabase } from '../packages/db/src';
import { saveVariable, getVariable, listVariables } from '../packages/db/src/variables';
import { DBVariableDefinition } from '../packages/db/src/variables';

describe('Variable persistence', () => {
  let db: any;

  beforeEach(() => {
    db = bootstrapDatabase(':memory:');
  });

  it('stores and retrieves a variable definition', () => {
    const varDef: DBVariableDefinition = {
      id: 'var1',
      name: 'test variable',
      description: 'a test variable',
      code: 'z.string()'
    };

    saveVariable(db, varDef);
    const retrieved = getVariable(db, 'var1');
    expect(retrieved).toEqual(varDef);
  });

  it('lists all stored variables', () => {
    const varDef1: DBVariableDefinition = {
      id: 'var1',
      name: 'test variable 1',
      description: 'a test variable',
      code: 'z.string()'
    };
    const varDef2: DBVariableDefinition = {
      id: 'var2',
      name: 'test variable 2',
      description: 'another test variable',
      code: 'z.number()'
    };

    saveVariable(db, varDef1);
    saveVariable(db, varDef2);
    const all = listVariables(db);
    expect(all).toEqual(expect.arrayContaining([varDef1, varDef2]));
  });
}); 