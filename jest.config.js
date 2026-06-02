/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/api/routes/routes.ts', // généré par TSOA
  ],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // Désactive emitDecoratorMetadata pour ne pas dépendre de reflect-metadata dans les tests
        tsconfig: {
          experimentalDecorators: true,
          emitDecoratorMetadata: false,
          strict: true,
          esModuleInterop: true,
          module: 'commonjs',
          target: 'ES2020',
        },
      },
    ],
  },
}
