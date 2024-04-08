import { describe, expect, it } from '@jest/globals';
import { clamp } from './clamp';

describe('clamp', () => {
  it('should clamp a number between a min and max', () => {
    expect.assertions(4);

    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, -10, 10)).toBe(-5);
    expect(clamp(999, 0, 10)).toBe(10);
    expect(clamp(-999, 0, 10)).toBe(0);
  });
});
