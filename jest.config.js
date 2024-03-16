/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  clearMocks: true,
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.[jt]s"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/src/singleton.ts"],
  roots: ["<rootDir>/src"],
  // collectCoverage: true,
  // coverageDirectory: "coverage",
};