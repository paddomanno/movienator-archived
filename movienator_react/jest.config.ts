//Automatically used by jest to configurate the tests
module.exports = {
  roots: ['./src/_test_'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // testPathIgnorePatterns: [".js"],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
export {};
