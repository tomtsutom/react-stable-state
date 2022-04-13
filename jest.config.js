module.exports = {
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "jsdom",
  coverageReporters: ["json", "json-summary", "text", "lcov", "clover"],
};
