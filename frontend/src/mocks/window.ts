/* eslint-disable import/no-unused-modules */

// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'addEventListener', {
  value: jest.fn().mockImplementation(() => ({})),
});

Object.defineProperty(window, 'navigator', {
  value: jest.fn().mockImplementation(() => ({})),
});
