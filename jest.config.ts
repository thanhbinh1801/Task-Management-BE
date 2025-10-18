// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',

  roots: ['<rootDir>/__tests__', '<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],

  // 👇 map alias "@/xxx" -> "<rootDir>/src/xxx"
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
};

export default config;
