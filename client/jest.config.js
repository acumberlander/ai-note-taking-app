const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/lib/supabase$': '<rootDir>/__mocks__/lib/supabase.ts',
    '^@material-tailwind/react$': '<rootDir>/src/__mocks__/@material-tailwind/react.tsx',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules'],
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@supabase|@material-tailwind)/)',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 