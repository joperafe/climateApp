/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  transformIgnorePatterns: [
    // transform react-leaflet and leaflet ESM packages
    'node_modules/(?!react-leaflet|@react-leaflet|leaflet)'
  ],
};
