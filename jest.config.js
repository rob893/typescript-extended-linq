'use strict';

const ignored = [
  '<rootDir>/dist/',
  '<rootDir>/src/__test-utilities__/',
  '<rootDir>/src/__benchmarks__/',
  '<rootDir>/_stryker-tmp/'
];

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ignored,
  coveragePathIgnorePatterns: ignored,
  modulePathIgnorePatterns: ignored,
  watchPathIgnorePatterns: ignored
};
