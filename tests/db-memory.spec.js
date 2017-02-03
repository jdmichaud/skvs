const lodash = require('lodash');
const testDb = require('./db.spec.helper');
const Db = require('../db-memory');

describe('db-memory', () => {
  let db;

  beforeEach(() => {
    db = Db();
  });

  it('shall create an element', () => {
    testDb.testCreate(db);
  });

  it('shall filter elements', () => {
    testDb.testFilter(db);
  });

  it('shall filter elements according to a query', () => {
    testDb.testFilterQuery(db);
  });

  it('shall update an element', () => {
    testDb.testUpdate(db);
  });

  it('shall delete an element', () => {
    testDb.testDel(db);
  });
});
