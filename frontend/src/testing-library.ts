import { afterEach, expect } from 'bun:test';
// biome-ignore lint/performance/noNamespaceImport: Tests
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

// Optional: cleans up `render` after each test
afterEach(() => {
  cleanup();
});
