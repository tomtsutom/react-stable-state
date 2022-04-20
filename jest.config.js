module.exports = {
  roots: ["<rootDir>/unit-tests"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "jsdom",
  coverageReporters: ["json", "json-summary", "text", "lcov", "clover"],
};
