import { describe, expect, it } from 'bun:test';
import {
  getTextWidth,
  normalizeDescendantSpaces,
  normalizeSpaces,
  processParagraphs,
  SMART_EDITOR_CONTENT_WIDTH,
} from '@/plate/plugins/paste';

describe('paste plugin', () => {
  describe('should calculate text width', () => {
    it('for short text', () => {
      expect(getTextWidth('This is a test text')).toBeLessThan(SMART_EDITOR_CONTENT_WIDTH);
    });

    it('for text with special characters', () => {
      expect(getTextWidth('This is a test text with special characters: !@#$%^&*()_+')).toBeLessThan(
        SMART_EDITOR_CONTENT_WIDTH,
      );
    });

    it('should calculate text width with special characters and spaces', () => {
      expect(getTextWidth('This is a test text with special characters: !@#$%^&*()_+ and spaces')).toBeLessThan(
        SMART_EDITOR_CONTENT_WIDTH,
      );
    });

    it('for text long text', () => {
      expect(
        getTextWidth(
          'This is a paragraph with a lot of text that should be split into multiple lines when copied from a PDF.',
        ),
      ).toBeGreaterThan(SMART_EDITOR_CONTENT_WIDTH);
    });
  });

  describe('split plain text into paragraphs', () => {
    it('text with unnatural breaks into separate paragraphs', () => {
      const raw = `This is a paragraph.
This is another paragraph.
This is a third paragraph.`;
      const expected = ['This is a paragraph.', 'This is another paragraph.', 'This is a third paragraph.'];

      const result = processParagraphs(raw);

      expect(result).toStrictEqual(expected);
    });

    it('text with natural breaks into same paragraph', () => {
      const raw = `This was probably a heading
This is another paragraph with a lot of text that should be split into multiple lines when copied
from a PDF. The PDF text is not formatted as a paragraph, but rather multiple lines. We try to
detect these lines and split them into paragraphs where natural.`;

      const expected = [
        'This was probably a heading',
        'This is another paragraph with a lot of text that should be split into multiple lines when copied from a PDF. The PDF text is not formatted as a paragraph, but rather multiple lines. We try to detect these lines and split them into paragraphs where natural.',
      ];

      const result = processParagraphs(raw);

      expect(result).toStrictEqual(expected);
    });

    it('text with unnatural breaks into separate paragraphs', () => {
      const raw = `This is a paragraph with a lot of text that should be split into multiple lines when copied from a
PDF.
This is a paragraph with a lot of text that should be split into multiple lines when copied from a
PDF.
This is a paragraph with a lot of text that should be split into multiple lines when copied from a
PDF.`;

      const actual = processParagraphs(raw);

      expect(actual).toStrictEqual([
        'This is a paragraph with a lot of text that should be split into multiple lines when copied from a PDF.',
        'This is a paragraph with a lot of text that should be split into multiple lines when copied from a PDF.',
        'This is a paragraph with a lot of text that should be split into multiple lines when copied from a PDF.',
      ]);
    });
    it('should remove double spaces', () => {
      const raw = 'This  has   double    spaces.';
      const result = processParagraphs(raw);

      expect(result).toStrictEqual(['This has double spaces.']);
    });

    it('should normalize non-breaking spaces', () => {
      const raw = 'Hello\u00A0\u00A0world';
      const result = processParagraphs(raw);

      expect(result).toStrictEqual(['Hello world']);
    });
  });

  describe('normalizeSpaces', () => {
    it('should normalize non-breaking spaces', () => {
      expect(normalizeSpaces('Hello\u00A0world')).toBe('Hello world');
    });

    it('should normalize thin spaces', () => {
      expect(normalizeSpaces('Hello\u2009world')).toBe('Hello world');
    });

    it('should normalize narrow no-break spaces', () => {
      expect(normalizeSpaces('Hello\u202Fworld')).toBe('Hello world');
    });

    it('should collapse mixed space-like characters', () => {
      expect(normalizeSpaces('Hello \u00A0 \u2009world')).toBe('Hello world');
    });

    it('should leave single regular spaces unchanged', () => {
      expect(normalizeSpaces('Hello world')).toBe('Hello world');
    });
  });

  describe('normalizeDescendantSpaces', () => {
    it('should collapse double spaces in text nodes', () => {
      const result = normalizeDescendantSpaces([{ text: 'Hello  world' }]);

      expect(result).toStrictEqual([{ text: 'Hello world' }]);
    });

    it('should collapse double spaces in nested element children', () => {
      const result = normalizeDescendantSpaces([
        { type: 'p', children: [{ text: 'Hello  world' }] },
        { type: 'p', children: [{ text: 'Foo   bar   baz' }] },
      ]);

      expect(result).toStrictEqual([
        { type: 'p', children: [{ text: 'Hello world' }] },
        { type: 'p', children: [{ text: 'Foo bar baz' }] },
      ]);
    });

    it('should preserve marks on text nodes', () => {
      const result = normalizeDescendantSpaces([{ text: 'Hello  world', bold: true }]);

      expect(result).toStrictEqual([{ text: 'Hello world', bold: true }]);
    });

    it('should normalize non-breaking spaces in nodes', () => {
      const result = normalizeDescendantSpaces([{ text: 'Hello\u00A0world\u00A0\u00A0!' }]);

      expect(result).toStrictEqual([{ text: 'Hello world !' }]);
    });
  });
});
