//Automatically used by jest to configurate the tests
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globalSetup: "./_test_/test_utils/setup.ts",
  globalTeardown: "./_test_/test_utils/teardown.ts",
};
