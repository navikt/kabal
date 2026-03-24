import { describe, expect, test } from 'bun:test';
import { fuzzyMatch } from './fuzzy-match';

describe('fuzzyMatch', () => {
  test('returns true for an exact match', () => {
    expect(fuzzyMatch('hello', 'hello')).toBe(true);
  });

  test('returns true when query is empty', () => {
    expect(fuzzyMatch('hello', '')).toBe(true);
  });

  test('returns true when both are empty', () => {
    expect(fuzzyMatch('', '')).toBe(true);
  });

  test('returns false when target is empty but query is not', () => {
    expect(fuzzyMatch('', 'a')).toBe(false);
  });

  test('returns true for a prefix match', () => {
    expect(fuzzyMatch('hello world', 'hello')).toBe(true);
  });

  test('returns true for a suffix match', () => {
    expect(fuzzyMatch('hello world', 'world')).toBe(true);
  });

  test('returns true for a substring match', () => {
    expect(fuzzyMatch('hello world', 'lo wo')).toBe(true);
  });

  test('returns true when characters appear in order but not contiguous', () => {
    expect(fuzzyMatch('hello world', 'hwr')).toBe(true);
  });

  test('returns true for scattered characters in order', () => {
    expect(fuzzyMatch('abcdefgh', 'aeg')).toBe(true);
  });

  test('returns false when characters appear out of order', () => {
    expect(fuzzyMatch('hello', 'olleh')).toBe(false);
  });

  test('returns false when a character is missing from target', () => {
    expect(fuzzyMatch('hello', 'hellx')).toBe(false);
  });

  test('returns false when query is longer than target', () => {
    expect(fuzzyMatch('hi', 'hello')).toBe(false);
  });

  test('is case-insensitive', () => {
    expect(fuzzyMatch('Hello World', 'hello world')).toBe(true);
    expect(fuzzyMatch('hello world', 'HELLO WORLD')).toBe(true);
    expect(fuzzyMatch('HeLLo WoRLd', 'hElLO wOrld')).toBe(true);
  });

  test('handles repeated characters correctly', () => {
    expect(fuzzyMatch('aaa', 'aa')).toBe(true);
    expect(fuzzyMatch('aa', 'aaa')).toBe(false);
  });

  test('matches single character query', () => {
    expect(fuzzyMatch('hello', 'h')).toBe(true);
    expect(fuzzyMatch('hello', 'o')).toBe(true);
    expect(fuzzyMatch('hello', 'z')).toBe(false);
  });

  test('handles special characters', () => {
    expect(fuzzyMatch('hello-world', 'h-w')).toBe(true);
    expect(fuzzyMatch('foo.bar.baz', 'f.b.b')).toBe(true);
    expect(fuzzyMatch('file (1).txt', 'f1t')).toBe(true);
  });

  test('handles unicode characters', () => {
    expect(fuzzyMatch('café', 'é')).toBe(true);
    expect(fuzzyMatch('naïve', 'ï')).toBe(true);
  });

  test('handles spaces in query', () => {
    expect(fuzzyMatch('hello world', ' ')).toBe(true);
    expect(fuzzyMatch('helloworld', ' ')).toBe(false);
  });

  test('matches digits', () => {
    expect(fuzzyMatch('abc123def', '123')).toBe(true);
    expect(fuzzyMatch('abc123def', 'a1d')).toBe(true);
  });

  test('handles query with duplicate characters in target', () => {
    expect(fuzzyMatch('abcabc', 'abc')).toBe(true);
    expect(fuzzyMatch('abcabc', 'cc')).toBe(true);
    expect(fuzzyMatch('abcabc', 'aca')).toBe(true);
  });

  test('returns false for completely unrelated strings', () => {
    expect(fuzzyMatch('hello', 'xyz')).toBe(false);
  });
});
