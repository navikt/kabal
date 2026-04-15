import { describe, expect, it } from 'bun:test';
import { createPlateEditor } from 'platejs/react';
import { removeEmptyElements } from '@/plate/plugins/cleanup/remove-empty-elements/remove-empty-elements';
import { TemplateSections } from '@/plate/template-sections';
import { createRedigerbarMaltekst, createSimpleParagraph, createTable } from '@/plate/templates/helpers';

describe('removeEmptyElements', () => {
  describe('paragraphs', () => {
    it('should remove a single empty paragraph', () => {
      const editor = createEditorFromParagraphs('Hello', '', 'World');
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleParagraph('Hello'), createSimpleParagraph('World')]);
    });

    it('should remove all empty paragraphs', () => {
      const editor = createEditorFromParagraphs('', 'Hello', '', '', 'World', '');
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleParagraph('Hello'), createSimpleParagraph('World')]);
    });

    it('should not remove non-empty paragraphs', () => {
      const editor = createEditorFromParagraphs('Hello', 'World');
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleParagraph('Hello'), createSimpleParagraph('World')]);
    });

    it('should not remove empty paragraphs inside table cells', () => {
      const editor = createPlateEditor({
        value: [createSimpleParagraph(''), createTable(1, 1), createSimpleParagraph('')],
      });
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createTable(1, 1)]);
    });

    it('should only remove empty paragraphs within the given range', () => {
      const editor = createEditorFromParagraphs('', 'Hello', '', 'World', '');
      const at = { anchor: { path: [1, 0], offset: 0 }, focus: { path: [3, 0], offset: 5 } };
      removeEmptyElements(editor, at);
      expect(editor.children).toEqual([
        createSimpleParagraph(''),
        createSimpleParagraph('Hello'),
        createSimpleParagraph('World'),
        createSimpleParagraph(''),
      ]);
    });

    it('should not remove the empty paragraph the caret is in', () => {
      const editor = createEditorFromParagraphs('Hello', '', '', 'World');
      // Caret is in the text node of the second empty paragraph (index 2).
      removeEmptyElements(editor, [], [2, 0]);
      expect(editor.children).toEqual([
        createSimpleParagraph('Hello'),
        createSimpleParagraph(''),
        createSimpleParagraph('World'),
      ]);
    });

    it('should not remove the last empty paragraph in redigerbar maltekst', () => {
      const redigerbarMaltekst = createRedigerbarMaltekst(TemplateSections.TITLE, [
        createSimpleParagraph(''),
        createSimpleParagraph(''),
      ]);
      const editor = createPlateEditor({ value: [redigerbarMaltekst] });
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createRedigerbarMaltekst(TemplateSections.TITLE, [createSimpleParagraph('')])]);
    });

    it('should remove the empty paragraphs in redigerbar maltekst', () => {
      const redigerbarMaltekst = createRedigerbarMaltekst(TemplateSections.TITLE, [
        createSimpleParagraph(''),
        createSimpleParagraph('not empty'),
        createSimpleParagraph(''),
      ]);
      const editor = createPlateEditor({ value: [redigerbarMaltekst] });
      removeEmptyElements(editor);
      expect(editor.children).toEqual([
        createRedigerbarMaltekst(TemplateSections.TITLE, [createSimpleParagraph('not empty')]),
      ]);
    });
  });
});

const createEditorFromParagraphs = (...paragraphs: string[]) =>
  createPlateEditor({
    value: paragraphs.map((p) => createSimpleParagraph(p)),
  });
