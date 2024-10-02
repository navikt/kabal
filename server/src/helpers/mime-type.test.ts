import { getMimeType } from '@app/helpers/mime-type';
import { describe, expect, it } from 'bun:test';

const TEST_CASES: [string, string][] = [
  ['index.js', 'application/javascript'],
  ['index.js.map', 'application/json'],
  ['index.css', 'text/css'],
  ['index.html', 'text/html'],
  ['index.json', 'application/json'],
  ['logo.png', 'image/png'],
  ['index.svg', 'image/svg+xml'],
  ['index.ico', 'image/x-icon'],
  ['index.woff', 'font/woff'],
  ['index.woff2', 'font/woff2'],
];

describe('MIME types', () => {
  it.each(TEST_CASES)('should detect %s MIME type', (fileName, expected) => {
    expect.assertions(1);
    const actual = getMimeType(fileName, true);
    expect(actual).toBe(expected);
  });
});
