
import { bootstrapDatabase } from '../packages/db/src/index';
import { saveFunction, getFunction, listFunctions } from '../packages/db/src/functions';
import type Database from 'better-sqlite3';

describe('Function Management', () => {
  let db: Database.Database;

  beforeAll(() => {
    db = bootstrapDatabase(':memory:');
  });

  afterAll(() => {
    db.close();
  });

  it('stores and retrieves a function definition', () => {
    const fnDef = {
      id: 'add',
      name: 'add',
      description: 'adds two numbers',
      inputVars: ['number', 'number'],
      outputVars: ['number'],
      code: '(a: number, b: number) => a + b'
    };

    saveFunction(db, fnDef);
    const retrieved = getFunction(db, 'add');
    expect(retrieved).toEqual(fnDef);
  });

  it('lists all stored functions', () => {
    const fnDef1 = {
      id: 'add',
      name: 'add',
      description: 'adds two numbers',
      inputVars: ['number', 'number'],
      outputVars: ['number'],
      code: '(a: number, b: number) => a + b'
    };
    const fnDef2 = {
      id: 'mul',
      name: 'mul',
      description: 'multiplies two numbers',
      inputVars: ['number', 'number'],
      outputVars: ['number'],
      code: '(a: number, b: number) => a * b'
    };

    saveFunction(db, fnDef1);
    saveFunction(db, fnDef2);
    const all = listFunctions(db);
    expect(all).toEqual(expect.arrayContaining([fnDef1, fnDef2]));
  });
}); 