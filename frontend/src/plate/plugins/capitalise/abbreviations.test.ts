import { describe, expect, it } from 'bun:test';
import { ABBREVIATION_REGEX } from '@app/plate/plugins/capitalise/helpers';

describe('abbreviaton regex', () => {
  it('should match e.l', () => {
    expect(ABBREVIATION_REGEX.test('e.l')).toBe(true);
  });

  it('should match bl.a', () => {
    expect(ABBREVIATION_REGEX.test('bl.a')).toBe(true);
  });

  it('should match d.d.', () => {
    expect(ABBREVIATION_REGEX.test('d.d.')).toBe(true);
  });

  it('should match ex.phil.', () => {
    expect(ABBREVIATION_REGEX.test('ex.phil.')).toBe(true);
  });

  it('should match f.o.m', () => {
    expect(ABBREVIATION_REGEX.test('f.o.m')).toBe(true);
  });

  it('should match e.Kr.', () => {
    expect(ABBREVIATION_REGEX.test('e.Kr.')).toBe(true);
  });

  it('should accept Norwegian letters', () => {
    expect(ABBREVIATION_REGEX.test('æ.ø.å.ÆØÅ.')).toBe(true);
  });

  it('should not match normal words', () => {
    expect(ABBREVIATION_REGEX.test('words')).toBe(false);
  });

  it('should not match abbreviatons that might as well be a word at the end of a sentence', () => {
    expect(ABBREVIATION_REGEX.test('spm.')).toBe(false);
    expect(ABBREVIATION_REGEX.test('eks.')).toBe(false);
    expect(ABBREVIATION_REGEX.test('normalwordendingasentence.')).toBe(false);
  });
});
