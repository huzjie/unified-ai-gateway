/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '^@uag/types$': '<rootDir>/../../packages/types/src/index.ts',
    '^@uag/core$': '<rootDir>/../../packages/core/src/index.ts',
    '^@uag/storage$': '<rootDir>/../../packages/storage/src/index.ts',
    '^@uag/providers$': '<rootDir>/../../packages/providers/src/index.ts',
  },
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  testMatch: ['**/*.test.ts'],
};
