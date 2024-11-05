import { afterEach, expect } from 'bun:test';
// biome-ignore lint/style/noNamespaceImport: https://bun.sh/guides/test/testing-library
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

// Optional: cleans up `render` after each test
afterEach(() => {
  cleanup();
});
