import { describe, expect, it } from 'bun:test';
import { BaseParagraphPlugin, getEditorPlugin } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { cleanupWhitespaceIssues } from '@/plate/plugins/cleanup/cleanup-whitespace';
import { WhitespaceDecorationPlugin } from '@/plate/plugins/whitespace-decoration';
import { createSimpleParagraph } from '@/plate/templates/helpers';
import { type FormattedText, type ParagraphElement, TextAlign } from '@/plate/types';

const createEditor = (...paragraphs: string[]) =>
  createPlateEditor({
    plugins: [WhitespaceDecorationPlugin],
    value: paragraphs.map((p) => createSimpleParagraph(p)),
  });

type Editor = ReturnType<typeof createEditor>;

const createEditorWithMarks = (...paragraphs: FormattedText[][]): Editor =>
  createPlateEditor({
    plugins: [WhitespaceDecorationPlugin],
    value: paragraphs.map<ParagraphElement>((children) => ({
      type: BaseParagraphPlugin.key,
      align: TextAlign.LEFT,
      children,
    })),
  });

const getDecorations = (editor: ReturnType<typeof createEditor>) => {
  const plugin = editor.getPlugin(WhitespaceDecorationPlugin);
  const ranges = [];

  for (const entry of editor.api.nodes({ at: [] })) {
    const result = plugin.decorate?.({ ...getEditorPlugin(editor, plugin), entry: entry });

    if (result !== undefined) {
      ranges.push(...result);
    }
  }

  return ranges;
};

describe('whitespace decoration', () => {
  it('should decorate a double space', () => {
    const editor = createEditor('Hello  world');
    const ranges = getDecorations(editor);
    expect(ranges).toHaveLength(1);
    expect(ranges).toMatchObject([{ anchor: { path: [0, 0], offset: 5 }, focus: { path: [0, 0], offset: 7 } }]);
  });

  it('should decorate a triple space', () => {
    const editor = createEditor('Hello   world');
    const ranges = getDecorations(editor);
    expect(ranges).toHaveLength(1);
    expect(ranges).toMatchObject([{ anchor: { path: [0, 0], offset: 5 }, focus: { path: [0, 0], offset: 8 } }]);
  });

  it('should decorate multiple runs in one paragraph', () => {
    const editor = createEditor('Hello  beautiful  world');
    const ranges = getDecorations(editor);
    expect(ranges).toHaveLength(2);
    expect(ranges).toMatchObject([
      { anchor: { offset: 5 }, focus: { offset: 7 } },
      { anchor: { offset: 16 }, focus: { offset: 18 } },
    ]);
  });

  it('should not decorate single spaces', () => {
    const editor = createEditor('Hello world');
    const ranges = getDecorations(editor);
    expect(ranges).toHaveLength(0);
  });

  it('should decorate across multiple paragraphs', () => {
    const editor = createEditor('Hello  world', 'Foo  bar');
    const ranges = getDecorations(editor);
    expect(ranges).toHaveLength(2);
    expect(ranges).toMatchObject([
      { anchor: { path: [0, 0] }, focus: { path: [0, 0] } },
      { anchor: { path: [1, 0] }, focus: { path: [1, 0] } },
    ]);
  });

  it('should not decorate empty text', () => {
    const editor = createEditor('');
    const ranges = getDecorations(editor);
    expect(ranges).toHaveLength(0);
  });

  it('should decorate double space across different marks', () => {
    const editor = createEditorWithMarks([{ text: 'hello ' }, { text: ' world', bold: true }]);
    const ranges = getDecorations(editor);
    expect(ranges).toHaveLength(1);
    expect(ranges).toMatchObject([
      {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 1], offset: 1 },
      },
    ]);
  });

  it('should decorate triple space across three marks', () => {
    const editor = createEditorWithMarks([{ text: 'a ' }, { text: ' ', bold: true }, { text: ' b', italic: true }]);
    const ranges = getDecorations(editor);
    expect(ranges).toHaveLength(1);
    expect(ranges).toMatchObject([
      {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 2], offset: 1 },
      },
    ]);
  });
});

describe('cleanupWhitespaceIssues', () => {
  it('should collapse double spaces', () => {
    const editor = createEditor('Hello  world');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should collapse triple spaces', () => {
    const editor = createEditor('Hello   world');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should handle multiple runs of double spaces', () => {
    const editor = createEditor('Double  spaces  between');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Double spaces between')]);
  });

  it('should not modify text without double spaces', () => {
    const editor = createEditor('Hello world');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should handle multiple paragraphs with extra spaces', () => {
    const editor = createEditor('Hello  world', 'Foo  bar');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world'), createSimpleParagraph('Foo bar')]);
  });

  it('should handle empty text', () => {
    const editor = createEditor('');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('')]);
  });

  it('should collapse double space across different marks', () => {
    const editor = createEditorWithMarks([{ text: 'hello ' }, { text: ' world', bold: true }]);
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([
      {
        type: BaseParagraphPlugin.key,
        align: TextAlign.LEFT,
        children: [{ text: 'hello ' }, { text: 'world', bold: true }],
      },
    ]);
  });

  it('should collapse triple space across marks', () => {
    const editor = createEditorWithMarks([{ text: 'a ' }, { text: ' ', bold: true }, { text: ' b', italic: true }]);
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([
      {
        type: BaseParagraphPlugin.key,
        align: TextAlign.LEFT,
        children: [{ text: 'a ' }, { text: 'b', italic: true }],
      },
    ]);
  });

  it('should trim leading whitespace', () => {
    const editor = createEditor('  Hello world');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should trim trailing whitespace', () => {
    const editor = createEditor('Hello world  ');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should trim both leading and trailing whitespace', () => {
    const editor = createEditor('  Hello world  ');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should handle whitespace-only paragraph', () => {
    const editor = createEditor('   ');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('')]);
  });

  it('should handle multiple paragraphs with leading and trailing spaces', () => {
    const editor = createEditor('  Hello  ', '  World  ');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello'), createSimpleParagraph('World')]);
  });

  it('should not modify text without whitespace issues', () => {
    const editor = createEditor('Hello world');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should preserve internal whitespace (single spaces)', () => {
    const editor = createEditor('  Hello   world  ');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should remove space before period', () => {
    const editor = createEditor('Hello world .');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world.')]);
  });

  it('should remove space before comma', () => {
    const editor = createEditor('Hello , world');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello, world')]);
  });

  it('should remove space before multiple different punctuation marks', () => {
    const editor = createEditor('Hello , world .');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello, world.')]);
  });

  it('should remove space before ellipsis (three dots)', () => {
    const editor = createEditor('Hello ...');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello...')]);
  });

  it('should remove space before ellipsis (special char)', () => {
    const editor = createEditor('Hello …');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello…')]);
  });

  it('should not remove space before double exclamation', () => {
    const editor = createEditor('Hello !!');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello!!')]);
  });

  it('should remove space before closing parenthesis', () => {
    const editor = createEditor('(Hello world )');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('(Hello world)')]);
  });

  it('should remove multiple spaces before punctuation', () => {
    const editor = createEditor('Hello   .');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello.')]);
  });

  it('should handle leading whitespace + double space + trailing whitespace', () => {
    const editor = createEditor('  hello  world  ');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('hello world')]);
  });

  it('should handle all issue types combined', () => {
    const editor = createEditor('  hello  world .  ');
    cleanupWhitespaceIssues(editor);
    expect(editor.children).toEqual([createSimpleParagraph('hello world.')]);
  });

  it('should only clean whitespace within the given range', () => {
    const editor = createEditor('Hello  world', 'Foo  bar', 'Baz  qux');
    const at = { anchor: { path: [1, 0], offset: 0 }, focus: { path: [1, 0], offset: 8 } };
    cleanupWhitespaceIssues(editor, at);
    expect(editor.children).toEqual([
      createSimpleParagraph('Hello  world'),
      createSimpleParagraph('Foo bar'),
      createSimpleParagraph('Baz  qux'),
    ]);
  });
});
