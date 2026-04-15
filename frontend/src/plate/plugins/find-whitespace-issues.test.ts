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
      const issues = findWhitespaceIssues(paragraph({ text: 'hello  world' }), ELEMENT_PATH);
      const ds = issues.filter((i) => i.type === WhitespaceIssueType.DoubleSpace);
      expect(ds).toHaveLength(1);
      expect(ds).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 7 },
          deleteAnchor: { path: [0, 0], offset: 6 },
        },
      ]);
    });

    it('should find a triple space', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'a   b' }), ELEMENT_PATH);
      const ds = issues.filter((i) => i.type === WhitespaceIssueType.DoubleSpace);
      expect(ds).toHaveLength(1);
      expect(ds).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 0], offset: 4 },
          deleteAnchor: { path: [0, 0], offset: 2 },
        },
      ]);
    });

    it('should find multiple double-space runs', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'a  b  c' }), ELEMENT_PATH);
      const ds = issues.filter((i) => i.type === WhitespaceIssueType.DoubleSpace);
      expect(ds).toHaveLength(2);
      expect(ds).toMatchObject([
        { anchor: { offset: 1 }, focus: { offset: 3 } },
        { anchor: { offset: 4 }, focus: { offset: 6 } },
      ]);
    });

    it('should return no double-space issues for single spaces', () => {
      const ds = findWhitespaceIssues(paragraph({ text: 'hello world' }), ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.DoubleSpace,
      );
      expect(ds).toHaveLength(0);
    });

    it('should find double space split across two text nodes', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello ' }, { text: ' world', bold: true }), ELEMENT_PATH);
      const ds = issues.filter((i) => i.type === WhitespaceIssueType.DoubleSpace);
      expect(ds).toHaveLength(1);
      expect(ds).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 1], offset: 1 },
          deleteAnchor: { path: [0, 1], offset: 0 },
        },
      ]);
    });

    it('should find triple space across three text nodes', () => {
      const issues = findWhitespaceIssues(
        paragraph({ text: 'a ' }, { text: ' ', bold: true }, { text: ' b', italic: true }),
        ELEMENT_PATH,
      );
      const ds = issues.filter((i) => i.type === WhitespaceIssueType.DoubleSpace);
      expect(ds).toHaveLength(1);
      expect(ds).toMatchObject([
        {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 2], offset: 1 },
          deleteAnchor: { path: [0, 1], offset: 0 },
        },
      ]);
    });

    it('should not detect double space across a placeholder element', () => {
      const element: TElement = {
        type: 'p',
        children: [{ text: 'word ' }, { type: 'placeholder', children: [{ text: '' }] }, { text: ' word' }],
      };
      const ds = findWhitespaceIssues(element, ELEMENT_PATH).filter((i) => i.type === WhitespaceIssueType.DoubleSpace);
      expect(ds).toHaveLength(0);
    });

    it('should place deleteAnchor one char after anchor', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'x    y' }), ELEMENT_PATH);
      const ds = issues.filter((i) => i.type === WhitespaceIssueType.DoubleSpace);
      expect(ds).toHaveLength(1);
      expect(ds).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          anchor: { offset: 1 },
          deleteAnchor: { offset: 2 },
          focus: { offset: 5 },
        },
      ]);
    });

    it('should place deleteAnchor in next node when anchor is at node boundary', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello ' }, { text: ' world', bold: true }), ELEMENT_PATH);
      const ds = issues.filter((i) => i.type === WhitespaceIssueType.DoubleSpace);
      expect(ds).toMatchObject([
        {
          type: WhitespaceIssueType.DoubleSpace,
          deleteAnchor: { path: [0, 1], offset: 0 },
        },
      ]);
    });

    it('should handle NBSP as a space character', () => {
      const ds = findWhitespaceIssues(paragraph({ text: 'a\u00A0 b' }), ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.DoubleSpace,
      );
      expect(ds).toHaveLength(1);
    });
  });

  describe('trailing whitespace', () => {
    it('should find a single trailing space', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello ' }), ELEMENT_PATH);
      const tw = issues.filter((i) => i.type === WhitespaceIssueType.TrailingWhitespace);
      expect(tw).toHaveLength(1);
      expect(tw).toMatchObject([
        {
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 6 },
        },
      ]);
    });

    it('should find multiple trailing spaces', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello   ' }), ELEMENT_PATH);
      const tw = issues.filter((i) => i.type === WhitespaceIssueType.TrailingWhitespace);
      expect(tw).toHaveLength(1);
      expect(tw).toMatchObject([
        {
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 8 },
        },
      ]);
    });

    it('should find trailing space in last text node across marks', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello' }, { text: ' ', bold: true }), ELEMENT_PATH);
      const tw = issues.filter((i) => i.type === WhitespaceIssueType.TrailingWhitespace);
      expect(tw).toHaveLength(1);
      expect(tw).toMatchObject([
        {
          anchor: { path: [0, 1], offset: 0 },
          focus: { path: [0, 1], offset: 1 },
        },
      ]);
    });

    it('should not flag trailing space when last child is an inline element', () => {
      const element: TElement = {
        type: 'p',
        children: [{ text: 'hello ' }, { type: 'link', children: [{ text: 'click' }] }],
      };
      const tw = findWhitespaceIssues(element, ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.TrailingWhitespace,
      );
      expect(tw).toHaveLength(0);
    });

    it('should not flag text without trailing spaces', () => {
      const tw = findWhitespaceIssues(paragraph({ text: 'hello' }), ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.TrailingWhitespace,
      );
      expect(tw).toHaveLength(0);
    });
  });

  describe('leading whitespace', () => {
    it('should find a single leading space', () => {
      const issues = findWhitespaceIssues(paragraph({ text: ' hello' }), ELEMENT_PATH);
      const lw = issues.filter((i) => i.type === WhitespaceIssueType.LeadingWhitespace);
      expect(lw).toHaveLength(1);
      expect(lw).toMatchObject([
        {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 1 },
        },
      ]);
    });

    it('should find multiple leading spaces', () => {
      const issues = findWhitespaceIssues(paragraph({ text: '   hello' }), ELEMENT_PATH);
      const lw = issues.filter((i) => i.type === WhitespaceIssueType.LeadingWhitespace);
      expect(lw).toHaveLength(1);
      expect(lw).toMatchObject([
        {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 3 },
        },
      ]);
    });

    it('should find leading space across marked text nodes', () => {
      const issues = findWhitespaceIssues(paragraph({ text: ' ' }, { text: ' hello', bold: true }), ELEMENT_PATH);
      const lw = issues.filter((i) => i.type === WhitespaceIssueType.LeadingWhitespace);
      expect(lw).toHaveLength(1);
      expect(lw).toMatchObject([
        {
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
      const lw = findWhitespaceIssues(element, ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.LeadingWhitespace,
      );
      expect(lw).toHaveLength(0);
    });

    it('should not flag text without leading spaces', () => {
      const lw = findWhitespaceIssues(paragraph({ text: 'hello' }), ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.LeadingWhitespace,
      );
      expect(lw).toHaveLength(0);
    });
  });

  describe('spaces before punctuation', () => {
    it('should find space before period', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello .' }), ELEMENT_PATH);
      const sbp = issues.filter((i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation);
      expect(sbp).toHaveLength(1);
      expect(sbp).toMatchObject([
        {
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 6 },
        },
      ]);
    });

    it('should find space before comma', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello ,world' }), ELEMENT_PATH);
      const sbp = issues.filter((i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation);
      expect(sbp).toHaveLength(1);
      expect(sbp).toMatchObject([
        {
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 6 },
        },
      ]);
    });

    it('should find space before semicolon, colon, exclamation, and question mark', () => {
      const filter = (issues: ReturnType<typeof findWhitespaceIssues>) =>
        issues.filter((i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation);
      expect(filter(findWhitespaceIssues(paragraph({ text: 'a ;' }), ELEMENT_PATH))).toHaveLength(1);
      expect(filter(findWhitespaceIssues(paragraph({ text: 'a :' }), ELEMENT_PATH))).toHaveLength(1);
      expect(filter(findWhitespaceIssues(paragraph({ text: 'a !' }), ELEMENT_PATH))).toHaveLength(1);
      expect(filter(findWhitespaceIssues(paragraph({ text: 'a ?' }), ELEMENT_PATH))).toHaveLength(1);
    });

    it('should find space before closing parenthesis', () => {
      const sbp = findWhitespaceIssues(paragraph({ text: '(hello )' }), ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation,
      );
      expect(sbp).toHaveLength(1);
    });

    it('should find multiple spaces before punctuation', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello  .' }), ELEMENT_PATH);
      const sbp = issues.filter((i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation);
      expect(sbp).toHaveLength(1);
      expect(sbp).toMatchObject([
        {
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 7 },
        },
      ]);
    });

    it('should find space before punctuation across text nodes', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello ' }, { text: '.world', bold: true }), ELEMENT_PATH);
      const sbp = issues.filter((i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation);
      expect(sbp).toHaveLength(1);
      expect(sbp).toMatchObject([
        {
          anchor: { path: [0, 0], offset: 5 },
        },
      ]);
    });

    it('should find multiple space-before-punctuation occurrences', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello , world .' }), ELEMENT_PATH);
      const sbp = issues.filter((i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation);
      expect(sbp).toHaveLength(2);
    });

    it('should flag space before ellipsis', () => {
      const sbp = findWhitespaceIssues(paragraph({ text: 'hello ...' }), ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation,
      );
      expect(sbp).toHaveLength(1);
    });

    it('should flag space before double punctuation', () => {
      const sbp = findWhitespaceIssues(paragraph({ text: 'hello !!' }), ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation,
      );
      expect(sbp).toHaveLength(1);
    });

    it('should flag space before Unicode ellipsis', () => {
      const sbp = findWhitespaceIssues(paragraph({ text: 'hello \u2026' }), ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation,
      );
      expect(sbp).toHaveLength(1);
    });

    it('should not flag punctuation without preceding space', () => {
      const sbp = findWhitespaceIssues(paragraph({ text: 'hello.' }), ELEMENT_PATH).filter(
        (i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation,
      );
      expect(sbp).toHaveLength(0);
    });
  });

  describe('combined cases', () => {
    it('should find both leading and trailing whitespace', () => {
      const issues = findWhitespaceIssues(paragraph({ text: ' hello ' }), ELEMENT_PATH);
      expect(issues).toHaveLength(2);
      expect(issues.filter((i) => i.type === WhitespaceIssueType.LeadingWhitespace)).toHaveLength(1);
      expect(issues.filter((i) => i.type === WhitespaceIssueType.TrailingWhitespace)).toHaveLength(1);
    });

    it('should find leading, trailing, and space before punctuation', () => {
      const issues = findWhitespaceIssues(paragraph({ text: ' hello , world . ' }), ELEMENT_PATH);
      expect(issues).toHaveLength(4);
      expect(issues.filter((i) => i.type === WhitespaceIssueType.LeadingWhitespace)).toHaveLength(1);
      expect(issues.filter((i) => i.type === WhitespaceIssueType.TrailingWhitespace)).toHaveLength(1);
      expect(issues.filter((i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation)).toHaveLength(2);
    });

    it('should detect overlapping double-space and space-before-punctuation', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello  .' }), ELEMENT_PATH);
      expect(issues).toHaveLength(2);
      expect(issues.filter((i) => i.type === WhitespaceIssueType.DoubleSpace)).toHaveLength(1);
      expect(issues.filter((i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation)).toHaveLength(1);
    });

    it('should handle text that is only spaces', () => {
      const issues = findWhitespaceIssues(paragraph({ text: '   ' }), ELEMENT_PATH);
      expect(issues).toHaveLength(3);
      expect(issues.filter((i) => i.type === WhitespaceIssueType.LeadingWhitespace)).toHaveLength(1);
      expect(issues.filter((i) => i.type === WhitespaceIssueType.TrailingWhitespace)).toHaveLength(1);
      expect(issues.filter((i) => i.type === WhitespaceIssueType.DoubleSpace)).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should return empty for empty text', () => {
      expect(findWhitespaceIssues(paragraph({ text: '' }), ELEMENT_PATH)).toHaveLength(0);
    });

    it('should return empty for no children', () => {
      const element: TElement = { type: 'p', children: [] };
      expect(findWhitespaceIssues(element, ELEMENT_PATH)).toHaveLength(0);
    });

    it('should handle NBSP as a space character for space before punctuation', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello\u00A0.' }), ELEMENT_PATH);
      const sbp = issues.filter((i) => i.type === WhitespaceIssueType.SpaceBeforePunctuation);
      expect(sbp).toHaveLength(1);
    });

    it('should use the provided element path in returned points', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'hello ' }), [2, 1]);
      expect(issues).toMatchObject([
        {
          anchor: { path: [2, 1, 0] },
          focus: { path: [2, 1, 0] },
        },
      ]);
    });

    it('should find leading space after line break', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'test.\n next line.' }), ELEMENT_PATH);
      expect(issues).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace, anchor: { offset: 6 }, focus: { offset: 7 } },
      ]);
    });

    it('should not flag line break without leading space', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'test.\nnext line.' }), ELEMENT_PATH);
      expect(issues).toMatchObject([]);
    });

    it('should find multiple leading spaces after line break', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'test.\n   next line' }), ELEMENT_PATH);
      expect(issues).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace, anchor: { offset: 6 }, focus: { offset: 9 } },
        { type: WhitespaceIssueType.DoubleSpace, anchor: { offset: 6 }, focus: { offset: 9 } },
      ]);
    });

    it('should find leading spaces after multiple line breaks', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'first.\n second.\n third' }), ELEMENT_PATH);
      expect(issues).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace },
        { type: WhitespaceIssueType.LeadingWhitespace },
      ]);
    });

    it('should find trailing space before line break', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'test. \nnext line' }), ELEMENT_PATH);
      expect(issues).toMatchObject([
        { type: WhitespaceIssueType.TrailingWhitespace, anchor: { offset: 5 }, focus: { offset: 6 } },
      ]);
    });

    it('should not flag line break without trailing space', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'test.\nnext line' }), ELEMENT_PATH);
      expect(issues).toMatchObject([]);
    });

    it('should find multiple trailing spaces before line break', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'test.   \nnext line' }), ELEMENT_PATH);
      expect(issues).toMatchObject([
        { type: WhitespaceIssueType.TrailingWhitespace, anchor: { offset: 5 }, focus: { offset: 8 } },
        { type: WhitespaceIssueType.DoubleSpace, anchor: { offset: 5 }, focus: { offset: 8 } },
      ]);
    });

    it('should find both trailing and leading spaces around line break', () => {
      const issues = findWhitespaceIssues(paragraph({ text: 'test. \n next line' }), ELEMENT_PATH);
      expect(issues).toMatchObject([
        { type: WhitespaceIssueType.LeadingWhitespace, anchor: { offset: 7 }, focus: { offset: 8 } },
        { type: WhitespaceIssueType.TrailingWhitespace, anchor: { offset: 5 }, focus: { offset: 6 } },
      ]);
    });
  });
});
