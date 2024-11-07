import { expect } from 'bun:test';
import { describe, it } from 'bun:test';
import { SMART_EDITOR_CONTENT_WIDTH, getTextWidth, processParagraphs } from '@app/plate/plugins/paste';

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
  });
});
