import { describe, expect, it } from 'bun:test';
import { BaseParagraphPlugin, type Path, type TElement } from 'platejs';
import { type FormattedText, type ParagraphElement, TextAlign } from '@/plate/types';
import { findWhitespaceIssues, WhitespaceIssueType } from './find-whitespace-issues';

const ELEMENT_PATH: Path = [0];

const paragraph = (...children: FormattedText[]): ParagraphElement => ({
  type: BaseParagraphPlugin.key,
  align: TextAlign.LEFT,
  children,
});

describe('findWhitespaceIssues', () => {
  describe('double spaces', () => {
    it('should find a double space', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello  world' }), ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 7 },
          deleteRanges: [{ anchor: { path: [0, 0], offset: 6 }, focus: { path: [0, 0], offset: 7 } }],
        },
      ]);
    });

    it('should find a triple space', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'a   b' }), ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 0], offset: 4 },
          deleteRanges: [{ anchor: { path: [0, 0], offset: 2 }, focus: { path: [0, 0], offset: 4 } }],
        },
      ]);
    });

    it('should find multiple double-space runs', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'a  b  c' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.DoubleSpace, anchor: { offset: 1 }, focus: { offset: 3 } },
        { type: WhitespaceIssueType.DoubleSpace, anchor: { offset: 4 }, focus: { offset: 6 } },
      ]);
    });

    it('should return no issues for single spaces', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello world' }), ELEMENT_PATH)).toEqual([]);
    });

    it('should find double space split across two text nodes', () => {
      expect(
        findWhitespaceIssues(paragraph({ text: 'hello ' }, { text: ' world', bold: true }), ELEMENT_PATH),
      ).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 1], offset: 1 },
          deleteRanges: [{ anchor: { path: [0, 1], offset: 0 }, focus: { path: [0, 1], offset: 1 } }],
        },
      ]);
    });

    it('should find triple space across three text nodes', () => {
      expect(
        findWhitespaceIssues(
          paragraph({ text: 'a ' }, { text: ' ', bold: true }, { text: ' b', italic: true }),
          ELEMENT_PATH,
        ),
      ).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 2], offset: 1 },
          deleteRanges: [{ anchor: { path: [0, 1], offset: 0 }, focus: { path: [0, 2], offset: 1 } }],
        },
      ]);
    });

    it('should not detect double space across a placeholder element', () => {
      const element: TElement = {
        type: 'p',
        children: [{ text: 'word ' }, { type: 'placeholder', children: [{ text: '' }] }, { text: ' word' }],
      };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toEqual([]);
    });

    it('should detect single space after placeholder that ends with space', () => {
      const element: TElement = {
        type: 'p',
        children: [{ text: 'before ' }, { type: 'placeholder', children: [{ text: 'value ' }] }, { text: ' after' }],
      };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 1, 0], offset: 5 },
          focus: { path: [0, 2], offset: 1 },
          deleteRanges: [{ anchor: { path: [0, 1, 0], offset: 5 }, focus: { path: [0, 1, 0], offset: 6 } }],
        },
      ]);
    });

    it('should detect multiple spaces after placeholder that ends with space', () => {
      const element: TElement = {
        type: 'p',
        children: [{ text: '' }, { type: 'placeholder', children: [{ text: 'value ' }] }, { text: '  after' }],
      };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 1, 0], offset: 5 },
          focus: { path: [0, 2], offset: 2 },
          deleteRanges: [
            { anchor: { path: [0, 1, 0], offset: 5 }, focus: { path: [0, 1, 0], offset: 6 } },
            { anchor: { path: [0, 2], offset: 1 }, focus: { path: [0, 2], offset: 2 } },
          ],
        },
      ]);
    });

    it('should not detect cross-boundary double space when placeholder does not end with space', () => {
      const element: TElement = {
        type: 'p',
        children: [{ text: '' }, { type: 'placeholder', children: [{ text: 'value' }] }, { text: ' after' }],
      };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toEqual([]);
    });

    it('should detect cross-boundary double space with nested inline element', () => {
      const element: TElement = {
        type: 'p',
        children: [
          { text: '' },
          { type: 'placeholder', children: [{ type: 'inner', children: [{ text: 'deep ' }] }] },
          { text: '  after' },
        ],
      };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 1, 0, 0], offset: 4 },
          focus: { path: [0, 2], offset: 2 },
          deleteRanges: [
            { anchor: { path: [0, 1, 0, 0], offset: 4 }, focus: { path: [0, 1, 0, 0], offset: 5 } },
            { anchor: { path: [0, 2], offset: 1 }, focus: { path: [0, 2], offset: 2 } },
          ],
        },
      ]);
    });

    it('should detect single trailing space before placeholder that starts with space', () => {
      const element: TElement = {
        type: 'p',
        children: [{ text: 'before ' }, { type: 'placeholder', children: [{ text: ' value' }] }, { text: ' after' }],
      };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 6 },
          focus: { path: [0, 1, 0], offset: 1 },
          deleteRanges: [{ anchor: { path: [0, 1, 0], offset: 0 }, focus: { path: [0, 1, 0], offset: 1 } }],
        },
      ]);
    });

    it('should detect multiple trailing spaces before placeholder that starts with space', () => {
      const element: TElement = {
        type: 'p',
        children: [{ text: 'before  ' }, { type: 'placeholder', children: [{ text: ' value' }] }, { text: '' }],
      };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 6 },
          focus: { path: [0, 1, 0], offset: 1 },
          deleteRanges: [
            { anchor: { path: [0, 1, 0], offset: 0 }, focus: { path: [0, 1, 0], offset: 1 } },
            { anchor: { path: [0, 0], offset: 6 }, focus: { path: [0, 0], offset: 7 } },
          ],
        },
      ]);
    });

    it('should not detect cross-boundary when placeholder does not start with space', () => {
      const element: TElement = {
        type: 'p',
        children: [{ text: 'before ' }, { type: 'placeholder', children: [{ text: 'value' }] }, { text: '' }],
      };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toEqual([]);
    });

    it('should keep first space and delete the rest', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'x    y' }), ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { offset: 1 },
          focus: { offset: 5 },
          deleteRanges: [{ anchor: { offset: 2 }, focus: { offset: 5 } }],
        },
      ]);
    });

    it('should place delete range start in next node when anchor is at node boundary', () => {
      expect(
        findWhitespaceIssues(paragraph({ text: 'hello ' }, { text: ' world', bold: true }), ELEMENT_PATH),
      ).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          deleteRanges: [{ anchor: { path: [0, 1], offset: 0 }, focus: { path: [0, 1], offset: 1 } }],
        },
      ]);
    });

    it('should handle NBSP as a space character', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'a\u00A0 b' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.DoubleSpace },
      ]);
    });
  });

  describe('trailing whitespace', () => {
    it('should not flag a single trailing space', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello ' }), ELEMENT_PATH)).toEqual([]);
    });

    it('should flag multiple trailing spaces', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello   ' }), ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.TrailingWhitespace,
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 8 },
        },
      ]);
    });

    it('should not flag single trailing space in last text node across marks', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello' }, { text: ' ', bold: true }), ELEMENT_PATH)).toMatchObject(
        [],
      );
    });

    it('should not flag text without trailing spaces', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello' }), ELEMENT_PATH)).toEqual([]);
    });
  });

  describe('leading whitespace', () => {
    it('should find a single leading space', () => {
      expect(findWhitespaceIssues(paragraph({ text: ' hello' }), ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.LeadingWhitespace,
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 1 },
        },
      ]);
    });

    it('should find multiple leading spaces', () => {
      expect(findWhitespaceIssues(paragraph({ text: '   hello' }), ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.LeadingWhitespace,
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 3 },
        },
      ]);
    });

    it('should find leading space across marked text nodes', () => {
      expect(
        findWhitespaceIssues(paragraph({ text: ' ' }, { text: ' hello', bold: true }), ELEMENT_PATH),
      ).toMatchObject([
        {
          type: WhitespaceIssueType.LeadingWhitespace,
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 1], offset: 1 },
        },
      ]);
    });

    it('should not flag leading space when first child is an inline element', () => {
      const element: TElement = {
        type: 'p',
        children: [{ type: 'link', children: [{ text: 'click' }] }, { text: ' hello' }],
      };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toEqual([]);
    });

    it('should not flag text without leading spaces', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello' }), ELEMENT_PATH)).toEqual([]);
    });
  });

  describe('collapseLeading option', () => {
    it('should not flag single leading space when collapseLeading is true', () => {
      expect(findWhitespaceIssues(paragraph({ text: ' hello' }), ELEMENT_PATH, { collapseLeading: true })).toEqual([]);
    });

    it('should flag double leading spaces as DoubleSpace when collapseLeading is true', () => {
      expect(
        findWhitespaceIssues(paragraph({ text: '  hello' }), ELEMENT_PATH, { collapseLeading: true }),
      ).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 2 },
          deleteRanges: [{ anchor: { path: [0, 0], offset: 1 }, focus: { path: [0, 0], offset: 2 } }],
        },
      ]);
    });

    it('should flag triple leading spaces as DoubleSpace when collapseLeading is true', () => {
      expect(
        findWhitespaceIssues(paragraph({ text: '   hello' }), ELEMENT_PATH, { collapseLeading: true }),
      ).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 3 },
          deleteRanges: [{ anchor: { path: [0, 0], offset: 1 }, focus: { path: [0, 0], offset: 3 } }],
        },
      ]);
    });

    it('should still flag leading whitespace without collapseLeading', () => {
      expect(findWhitespaceIssues(paragraph({ text: ' hello' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace },
      ]);
    });
  });

  describe('strictTrailing option', () => {
    it('should flag single trailing space when strictTrailing is true', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello ' }), ELEMENT_PATH, { strictTrailing: true })).toMatchObject(
        [
          {
            type: WhitespaceIssueType.TrailingWhitespace,
            anchor: { path: [0, 0], offset: 5 },
            focus: { path: [0, 0], offset: 6 },
          },
        ],
      );
    });

    it('should not flag single trailing space without strictTrailing', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello ' }), ELEMENT_PATH)).toEqual([]);
    });
  });

  describe('spaces before punctuation', () => {
    it('should find space before period', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello .' }), ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.SpaceBeforePunctuation,
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 6 },
        },
      ]);
    });

    it('should find space before comma', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello ,world' }), ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.SpaceBeforePunctuation,
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 6 },
        },
      ]);
    });

    it('should find space before semicolon, colon, exclamation, and question mark', () => {
      const expected = [{ type: WhitespaceIssueType.SpaceBeforePunctuation }];
      expect(findWhitespaceIssues(paragraph({ text: 'a ;' }), ELEMENT_PATH)).toMatchObject(expected);
      expect(findWhitespaceIssues(paragraph({ text: 'a :' }), ELEMENT_PATH)).toMatchObject(expected);
      expect(findWhitespaceIssues(paragraph({ text: 'a !' }), ELEMENT_PATH)).toMatchObject(expected);
      expect(findWhitespaceIssues(paragraph({ text: 'a ?' }), ELEMENT_PATH)).toMatchObject(expected);
    });

    it('should find space before closing parenthesis', () => {
      expect(findWhitespaceIssues(paragraph({ text: '(hello )' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.SpaceBeforePunctuation },
      ]);
    });

    it('should find multiple spaces before punctuation', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello  .' }), ELEMENT_PATH)).toMatchObject([
        {
          type: WhitespaceIssueType.SpaceBeforePunctuation,
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 7 },
        },
      ]);
    });

    it('should find space before punctuation across text nodes', () => {
      expect(
        findWhitespaceIssues(paragraph({ text: 'hello ' }, { text: '.world', bold: true }), ELEMENT_PATH),
      ).toMatchObject([
        {
          type: WhitespaceIssueType.SpaceBeforePunctuation,
          anchor: { path: [0, 0], offset: 5 },
        },
      ]);
    });

    it('should find multiple space-before-punctuation occurrences', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello , world .' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.SpaceBeforePunctuation },
        { type: WhitespaceIssueType.SpaceBeforePunctuation },
      ]);
    });

    it('should flag space before ellipsis', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello ...' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.SpaceBeforePunctuation },
      ]);
    });

    it('should flag space before double punctuation', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello !!' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.SpaceBeforePunctuation },
      ]);
    });

    it('should flag space before Unicode ellipsis', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello \u2026' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.SpaceBeforePunctuation },
      ]);
    });

    it('should not flag punctuation without preceding space', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello.' }), ELEMENT_PATH)).toEqual([]);
    });
  });

  describe('combined cases', () => {
    it('should find only leading whitespace for single leading and trailing space', () => {
      expect(findWhitespaceIssues(paragraph({ text: ' hello ' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace },
      ]);
    });

    it('should find leading whitespace and spaces before punctuation', () => {
      expect(findWhitespaceIssues(paragraph({ text: ' hello , world . ' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace },
        { type: WhitespaceIssueType.SpaceBeforePunctuation },
        { type: WhitespaceIssueType.SpaceBeforePunctuation },
      ]);
    });

    it('should not produce double-space when covered by space-before-punctuation', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello  .' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.SpaceBeforePunctuation },
      ]);
    });

    it('should handle text that is only spaces', () => {
      expect(findWhitespaceIssues(paragraph({ text: '   ' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace },
        { type: WhitespaceIssueType.TrailingWhitespace },
      ]);
    });
  });

  describe('edge cases', () => {
    it('should return empty for empty text', () => {
      expect(findWhitespaceIssues(paragraph({ text: '' }), ELEMENT_PATH)).toEqual([]);
    });

    it('should return empty for no children', () => {
      const element: TElement = { type: 'p', children: [] };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toEqual([]);
    });

    it('should handle NBSP as a space character for space before punctuation', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'hello\u00A0.' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.SpaceBeforePunctuation },
      ]);
    });

    it('should use the provided element path in returned points', () => {
      expect(findWhitespaceIssues(paragraph({ text: ' hello' }), [2, 1])).toMatchObject([
        {
          type: WhitespaceIssueType.LeadingWhitespace,
          anchor: { path: [2, 1, 0] },
          focus: { path: [2, 1, 0] },
        },
      ]);
    });

    it('should find leading space after line break', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'test.\n next line.' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace, anchor: { offset: 6 }, focus: { offset: 7 } },
      ]);
    });

    it('should not flag line break without leading space', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'test.\nnext line.' }), ELEMENT_PATH)).toEqual([]);
    });

    it('should find multiple leading spaces after line break without duplicate double-space', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'test.\n   next line' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace, anchor: { offset: 6 }, focus: { offset: 9 } },
      ]);
    });

    it('should find leading spaces after multiple line breaks', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'first.\n second.\n third' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace },
        { type: WhitespaceIssueType.LeadingWhitespace },
      ]);
    });

    it('should not flag single trailing space before line break', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'test. \nnext line' }), ELEMENT_PATH)).toEqual([]);
    });

    it('should not flag line break without trailing space', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'test.\nnext line' }), ELEMENT_PATH)).toEqual([]);
    });

    it('should find multiple trailing spaces before line break', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'test.   \nnext line' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.TrailingWhitespace, anchor: { offset: 5 }, focus: { offset: 8 } },
      ]);
    });

    it('should find leading space after line break but not single trailing space before it', () => {
      expect(findWhitespaceIssues(paragraph({ text: 'test. \n next line' }), ELEMENT_PATH)).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace, anchor: { offset: 7 }, focus: { offset: 8 } },
      ]);
    });
  });
});
