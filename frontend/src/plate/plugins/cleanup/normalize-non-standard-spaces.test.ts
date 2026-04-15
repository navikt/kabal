import { describe, expect, it } from 'bun:test';
import { createPlateEditor } from 'platejs/react';
import { normalizeNonStandardSpaces } from '@/plate/plugins/cleanup/normalize-non-standard-spaces';
import { createSimpleParagraph } from '@/plate/templates/helpers';

const createEditor = (...paragraphs: string[]) =>
  createPlateEditor({
    value: paragraphs.map((p) => createSimpleParagraph(p)),
  });

describe('normalizeNonStandardSpaces', () => {
  it('should replace NBSP with regular space', () => {
    const editor = createEditor('Hello\u00A0world');
    normalizeNonStandardSpaces(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should replace thin space with regular space', () => {
    const editor = createEditor('Hello\u2009world');
    normalizeNonStandardSpaces(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should replace em space with regular space', () => {
    const editor = createEditor('Hello\u2003world');
    normalizeNonStandardSpaces(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should replace multiple non-standard spaces in one text node', () => {
    const editor = createEditor('Non\u00A0standard\u00A0spaces');
    normalizeNonStandardSpaces(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Non standard spaces')]);
  });

  it('should handle multiple paragraphs', () => {
    const editor = createEditor('Hello\u00A0world', 'Foo\u00A0bar');
    normalizeNonStandardSpaces(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world'), createSimpleParagraph('Foo bar')]);
  });

  it('should not modify regular spaces', () => {
    const editor = createEditor('Hello world');
    normalizeNonStandardSpaces(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should only normalize non-standard spaces within the given range', () => {
    const editor = createEditor('Hello\u00A0world', 'Foo\u00A0bar', 'Baz\u00A0qux');
    const at = { anchor: { path: [1, 0], offset: 0 }, focus: { path: [1, 0], offset: 7 } };
    normalizeNonStandardSpaces(editor, at);
    expect(editor.children).toEqual([
      createSimpleParagraph('Hello\u00A0world'),
      createSimpleParagraph('Foo bar'),
      createSimpleParagraph('Baz\u00A0qux'),
    ]);
  });
});
