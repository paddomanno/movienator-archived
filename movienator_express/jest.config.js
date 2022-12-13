//Automatically used by jest to configurate the tests
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [".js"],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
