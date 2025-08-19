const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} **/
module.exports = {
  runner: 'groups',
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.(test|spec).ts', '**/?(*.)+(test|spec).ts'],
  clearMocks: true,
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 30000,
};
