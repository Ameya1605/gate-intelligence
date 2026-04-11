/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@gate/shared-types$': '<rootDir>/../../packages/shared-types/src',
    '^@gate/analytics-engine$': '<rootDir>/../../packages/analytics-engine/src',
  },
};
