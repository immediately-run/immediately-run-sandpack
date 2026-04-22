module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/setup.jest.ts"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  transform: {
    "\\.css\\.ts$": "@vanilla-extract/jest-transform",
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  globals: {
    "process.env.TEST_ENV": "true",
  },
};
