module.exports = {
  READ: 'read',
  WRITE: 'write',

  // see https://www.postgresql.org/docs/15/errcodes-appendix.html
  DUPLICATE_OBJECT: '42710',
  DUPLICATE_TABLE: '42P07',
  NUMERIC_VALUE_OUT_OF_RANGE: '22003',
  QUERY_CANCELED: '57014',
  READ_ONLY_SQL_TRANSACTION: '25006',
  UNDEFINED_COLUMN: '42703',
  UNDEFINED_OBJECT: '42704',
  UNDEFINED_TABLE: '42P01',
  UNDEFINED_FUNCTION: '42883',
  UNIQUE_VIOLATION: '23505',
  CHECK_VIOLATION: '23514',
  SYNTAX_ERROR: '42601',
  FOREIGN_KEY_VIOLATION: '23503',
};
