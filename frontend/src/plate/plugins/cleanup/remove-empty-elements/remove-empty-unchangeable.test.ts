import { describe, expect, it } from 'bun:test';
import { createPlateEditor } from 'platejs/react';
import { removeEmptyElements } from '@/plate/plugins/cleanup/remove-empty-elements/remove-empty-elements';
import { ELEMENT_REGELVERK } from '@/plate/plugins/element-types';
import { TemplateSections } from '@/plate/template-sections';
import {
  createHeadingOne,
  createHeadingTwo,
  createMaltekst,
  createMaltekstseksjon,
  createPageBreak,
  createRegelverkContainer,
  createSimpleParagraph,
} from '@/plate/templates/helpers';
import type { RegelverkContainerElement, RegelverkElement } from '@/plate/types';

describe('removeEmptyElements', () => {
  describe('unchangeable elements', () => {
    it('should not remove empty paragraphs inside a maltekst element', () => {
      const maltekst = createMaltekst(TemplateSections.TITLE, [createSimpleParagraph('')]);
      const editor = createPlateEditor({
        value: [createSimpleParagraph('before'), maltekst, createSimpleParagraph('after')],
      });
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleParagraph('before'), maltekst, createSimpleParagraph('after')]);
    });

    it('should not remove empty headings inside a maltekst element', () => {
      const maltekst = createMaltekst(TemplateSections.TITLE, [createHeadingOne('')]);
      const editor = createPlateEditor({
        value: [createSimpleParagraph('before'), maltekst, createSimpleParagraph('after')],
      });
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleParagraph('before'), maltekst, createSimpleParagraph('after')]);
    });

    it('should remove empty paragraphs inside a regelverk-container', () => {
      const container = createRegelverkContainer([createSimpleParagraph('keep'), createSimpleParagraph('')]);
      const regelverk = createRegelverkElement(container);
      const editor = createPlateEditor({ value: [regelverk] });
      removeEmptyElements(editor);
      const expectedRegelverk = createRegelverkElement(createRegelverkContainer([createSimpleParagraph('keep')]));
      expect(editor.children).toEqual([expectedRegelverk]);
    });

    it('should remove empty headings inside a regelverk-container', () => {
      const container = createRegelverkContainer([createHeadingOne('keep'), createHeadingTwo('')]);
      const regelverk = createRegelverkElement(container);
      const editor = createPlateEditor({ value: [regelverk] });
      removeEmptyElements(editor);
      const expectedRegelverk = createRegelverkElement(createRegelverkContainer([createHeadingOne('keep')]));
      expect(editor.children).toEqual([expectedRegelverk]);
    });

    it('should not remove empty paragraphs inside a maltekst within a maltekstseksjon', () => {
      const maltekst = createMaltekst(TemplateSections.TITLE, [
        createSimpleParagraph('keep'),
        createSimpleParagraph(''),
      ]);
      const maltekstseksjon = createMaltekstseksjon(TemplateSections.TITLE, undefined, [], [maltekst]);
      const editor = createPlateEditor({ value: [maltekstseksjon] });
      removeEmptyElements(editor);
      expect(editor.children).toEqual([maltekstseksjon]);
    });

    it('should remove empty elements outside unchangeable elements while preserving those inside', () => {
      const maltekst = createMaltekst(TemplateSections.TITLE, [createSimpleParagraph('')]);
      const editor = createPlateEditor({
        value: [createSimpleParagraph(''), maltekst, createHeadingOne('')],
      });
      removeEmptyElements(editor);
      expect(editor.children).toEqual([maltekst]);
    });
  });
});

/** Create a regelverk element with a custom regelverk-container. */
const createRegelverkElement = (container: RegelverkContainerElement): RegelverkElement => ({
  type: ELEMENT_REGELVERK,
  section: TemplateSections.REGELVERK_TITLE,
  children: [createPageBreak(), createMaltekstseksjon(TemplateSections.REGELVERK_TITLE), container],
});
