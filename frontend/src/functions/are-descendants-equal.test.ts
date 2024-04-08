import { afterEach, describe, expect, it, jest } from '@jest/globals';
import '@app/mocks/window';
import { TElement, TText } from '@udecode/plate-common';
import { areDescendantsEqual, areKeysEqual } from '@app/functions/are-descendants-equal';

describe('are-descendants-equal', () => {
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return false if the two lists are of different lengths', () => {
    expect.assertions(1);
    const listA = [p('a'), p('b'), p('c'), p('d')];
    const listB = [p('a'), p('b'), p('c')];
    expect(areDescendantsEqual(listA, listB)).toBe(false);
  });

  it('should return false if nested descendants differ', () => {
    expect.assertions(1);
    const listA = [p('a'), p('b'), p('c')];
    const listB = [p('a'), p('2'), p('c')];
    expect(areDescendantsEqual(listA, listB)).toBe(false);
  });

  it('should return true if nested descendants are equal', () => {
    expect.assertions(1);
    const listA = [p('a'), p('b'), p('c')];
    const listB = [p('a'), p('b'), p('c')];
    expect(areDescendantsEqual(listA, listB)).toBe(true);
  });

  it('should return false if deeply nested descendants differ', () => {
    expect.assertions(1);
    const listA = [ul([(p('a'), p('b'), p('c'))])];
    const listB = [ul([p('a'), p('2'), p('c')])];
    expect(areDescendantsEqual(listA, listB)).toBe(false);
  });

  it('should return true if deeply nested descendants are equal', () => {
    expect.assertions(1);
    const listA = [ul([p('a'), p('b'), p('c')])];
    const listB = [ul([p('a'), p('b'), p('c')])];
    expect(areDescendantsEqual(listA, listB)).toBe(true);
  });

  it('should return false if properties have different values', () => {
    expect.assertions(1);
    const listA = [ul([p('a', { indent: 0 })])];
    const listB = [ul([p('a', { indent: 1 })])];
    expect(areDescendantsEqual(listA, listB)).toBe(false);
  });

  it('should return false if descendant have different properties', () => {
    expect.assertions(1);
    const listA = [ul([p('a', { align: 'left' })])];
    const listB = [ul([p('a')])];
    expect(areDescendantsEqual(listA, listB)).toBe(false);
  });
});

const p = (text: string, ...props: Record<string, string | number>[]): TElement => e('p', [{ text, ...props }]);
const ul = (children: (TText | TElement)[], ...props: Record<string, string | number>[]): TElement =>
  e('ul', children, ...props);

const e = (type: string, children: (TText | TElement)[], ...props: Record<string, string | number>[]) => ({
  type,
  children,
  ...props,
});

describe('are-keys-equal', () => {
  it('should return true if the keys and values are equal', () => {
    expect.assertions(1);
    expect(areKeysEqual({ a: true }, { a: true })).toBe(true);
  });

  it('should return false if the number of keys is different', () => {
    expect.assertions(1);
    expect(areKeysEqual({ a: true, b: true }, { a: true })).toBe(false);
  });

  it('should return false if the values are not equal', () => {
    expect.assertions(1);
    expect(areKeysEqual({ a: true }, { a: false })).toBe(false);
  });

  it('should return false if the keys are not equal', () => {
    expect.assertions(1);
    expect(areKeysEqual({ a: true }, { b: false })).toBe(false);
  });

  it('missing key is equal to undefined value for same key', () => {
    expect.assertions(1);
    expect(areKeysEqual({ a: undefined }, { b: undefined })).toBe(true);
  });

  it('should return true if nested objects are equal', () => {
    expect.assertions(1);
    expect(areKeysEqual({ a: { b: true } }, { a: { b: true } })).toBe(true);
  });

  it('should return false if nested objects are not equal', () => {
    expect.assertions(1);
    expect(areKeysEqual({ a: { b: true } }, { a: { b: false } })).toBe(false);
  });
});
