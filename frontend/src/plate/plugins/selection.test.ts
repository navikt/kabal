import { describe, expect, it } from 'bun:test';
import { getWordEnd, getWordStart } from '@/plate/plugins/selection';

describe('getWordStart', () => {
  it('moves offset to start of word', () => {
    expect(getWordStart('Hei verden', 7)).toBe(4); // Hei ver|den → Hei |verden
  });

  it('does not move offset when right after punctuation', () => {
    expect(getWordStart('Hei verden. Neste', 11)).toBe(11); // Hei verden.| Neste → Hei verden.| Neste
    expect(getWordStart('Hei verden, neste', 11)).toBe(11); // Hei verden,| neste → Hei verden,| neste
    expect(getWordStart('Hei verden? Neste', 11)).toBe(11); // Hei verden?| Neste → Hei verden?| Neste
  });

  it('does not move offset when after whitespace', () => {
    expect(getWordStart('Hei verden. Neste', 12)).toBe(12); // Hei verden. |Neste → Hei verden. |Neste
  });

  it('stops at punctuation inside the word boundary', () => {
    expect(getWordStart('(verden', 5)).toBe(1); // (verd|en → (|verden
  });

  it('includes hyphens and apostrophes between letters', () => {
    expect(getWordStart('Send e-post', 9)).toBe(5); // Send e-po|st → Send |e-post
    expect(getWordStart('Send e-post', 6)).toBe(5); // Send e|-post → Send |e-post
    expect(getWordStart('Send e-post', 7)).toBe(5); // Send e-|post → Send |e-post
    expect(getWordStart("Per's", 5)).toBe(0); // Per's| → |Per's
    expect(getWordStart("Per's", 3)).toBe(0); // Per|'s → |Per's
    expect(getWordStart("Per's", 4)).toBe(0); // Per'|s → |Per's
  });

  it('includes combining marks', () => {
    expect(getWordStart('Hei cafe\u0301', 9)).toBe(4); // Hei café| → Hei |café
  });

  it('handles Norwegian letters and digits', () => {
    expect(getWordStart('Hei blåbær', 8)).toBe(4); // Hei blåb|ær → Hei |blåbær
    expect(getWordStart('Sak 2024', 6)).toBe(4); // Sak 20|24 → Sak |2024
  });
});

describe('getWordEnd', () => {
  it('moves offset to end of word', () => {
    expect(getWordEnd('Hei verden', 6)).toBe(10); // Hei ve|rden → Hei verden|
  });

  it('does not move offset when right before punctuation', () => {
    expect(getWordEnd('Hei verden. Neste', 10)).toBe(10); // Hei verden|. Neste → Hei verden|. Neste
  });

  it('stops at punctuation', () => {
    expect(getWordEnd('Hei verden. Neste', 6)).toBe(10); // Hei ve|rden. Neste → Hei verden|. Neste
  });

  it('does not move offset when before whitespace', () => {
    expect(getWordEnd('Hei verden', 3)).toBe(3); // Hei| verden → Hei| verden
  });

  it('includes hyphens and apostrophes between letters', () => {
    expect(getWordEnd('Send e-post nå', 5)).toBe(11); // Send |e-post nå → Send e-post| nå
    expect(getWordEnd('Send e-post nå', 8)).toBe(11); // Send e-p|ost nå → Send e-post| nå
    expect(getWordEnd('Send e-post nå', 6)).toBe(11); // Send e|-post nå → Send e-post| nå
    expect(getWordEnd('Send e-post nå', 7)).toBe(11); // Send e-|post nå → Send e-post| nå
    expect(getWordEnd("Per's", 3)).toBe(5); // Per|'s → Per's|
    expect(getWordEnd("Per's", 4)).toBe(5); // Per'|s → Per's|
  });

  it('includes combining marks', () => {
    expect(getWordEnd('Hei cafe\u0301', 6)).toBe(9); // Hei ca|fé → Hei café|
  });
});
