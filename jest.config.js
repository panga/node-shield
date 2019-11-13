module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['src/**/*'],
  modulePathIgnorePatterns: ['npm-cache', '.npm'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};
