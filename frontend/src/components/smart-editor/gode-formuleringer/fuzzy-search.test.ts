import { describe, expect, it } from 'vitest';
import { splitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';
import { fuzzySearch } from './fuzzy-search';

const TEXT = 'the quick brown fox jumps over the lazy dog';

describe('fuzzy search', () => {
  it('should work with punctuation', () => {
    expect.assertions(1);
    expect(fuzzySearch(splitQuery('test'), 'test.')).toBe(100);
  });

  it('should work with numbers', () => {
    expect.assertions(1);
    expect(fuzzySearch(splitQuery('123'), '123')).toBe(100);
  });

  it('should work with Norwegian characters', () => {
    expect.assertions(1);
    expect(fuzzySearch(splitQuery('blåbærsyltetøy'), 'blåbærsyltetøy')).toBe(100);
  });

  it('should accept partial word hits in text', () => {
    expect.assertions(1);
    expect(fuzzySearch(splitQuery('test'), 'this is testing')).toBe(100);
  });

  it('should not accept partial hits in query', () => {
    expect.assertions(1);
    expect(fuzzySearch(splitQuery('testing'), 'test')).toBe(0);
  });

  it('should score no hits as zero', () => {
    expect.assertions(1);
    expect(fuzzySearch(splitQuery('123'), TEXT)).toBe(0);
  });

  it('should score longer hits better', () => {
    expect.assertions(3);

    const longer = fuzzySearch(splitQuery('the quick brown fox jumps'), 'the quick brown fox jumps');
    const shorter1 = fuzzySearch(splitQuery('the quick brown fox jumps'), 'the quick brown fox');
    const shorter2 = fuzzySearch(splitQuery('the quick brown fox asdf'), 'the quick brown fox jumps');

    expect(longer).toBe(100);
    expect(shorter1).toBe(80);
    expect(shorter2).toBe(80);
  });

  it('should score empty strings as 0', () => {
    expect.assertions(3);

    expect(fuzzySearch(splitQuery(''), TEXT)).toBe(0);
    expect(fuzzySearch(splitQuery('the'), '')).toBe(0);
    expect(fuzzySearch(splitQuery(''), '')).toBe(0);
  });

  it('should score earlier occurences same as later ones', () => {
    expect.assertions(1);

    const fox = fuzzySearch(splitQuery('fox'), TEXT);
    const dog = fuzzySearch(splitQuery('dog'), TEXT);

    expect(fox).toStrictEqual(dog);
  });

  it('should score queries enclosed in quotes twice as much as non-quoted', () => {
    expect.assertions(1);

    const quoted = fuzzySearch(splitQuery('"quick" asdf'), TEXT);
    const nonQuoted = fuzzySearch(splitQuery('"asdf" quick'), TEXT);

    expect(quoted).toStrictEqual(nonQuoted * 2);
  });

  it('should work with multi-worded queries enclosed in quotes', () => {
    expect.assertions(1);
    expect(fuzzySearch(splitQuery('"quick brown fox"'), TEXT)).toBe(100);
  });

  it('should be case-insentitive', () => {
    expect.assertions(1);
    expect(fuzzySearch(splitQuery('the QUICK bRoWn'), TEXT)).toBe(100);
  });

  it('should work with multiple quoted expressions', () => {
    expect.assertions(3);

    expect(fuzzySearch(splitQuery('"quick" "brown" asdf'), TEXT)).toBe(80);
    expect(fuzzySearch(splitQuery('"asdf" quick brown'), TEXT)).toBe(50);
    expect(
      fuzzySearch(
        splitQuery('dokument rett syk "Høyesteretts dom HR-2018-2344-A"'),
        'Det er du som må dokumentere at du har rett til sykepenger. Ved vurderingen av om du har rett til sykepenger, skal NAV legge til grunn det som er mest sannsynlig. Vi legger mest vekt på tidsnære opplysninger. NAV kan overprøve legens vurderinger. Dette går frem av folketrygdloven § 8-4 første ledd, Høyesteretts dom HR-2018-2344-A og NAVs rundskriv.',
      ),
    ).toBe(100);
  });

  it('should only accept perfect matches for quoted expressions', () => {
    expect.assertions(3);

    expect(fuzzySearch(splitQuery('"quick brown fox"'), TEXT)).toBe(100);
    expect(fuzzySearch(splitQuery('"quick brrown fox"'), TEXT)).toBe(0);
    expect(fuzzySearch(splitQuery('"quick brown foxx"'), TEXT)).toBe(0);
  });
});
