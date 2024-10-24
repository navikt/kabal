import { describe, expect, it } from 'bun:test';
import { EMPTY_CHAR_CODE } from '@app/functions/remove-empty-char-in-text';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { type KabalValue, type ParagraphElement, type PlaceholderElement, TextAlign } from '@app/plate/types';
import { BaseParagraphPlugin } from '@udecode/plate-core';
import { createPlateEditor } from '@udecode/plate-core/react';
import type { Point, Selection, TextUnit } from 'slate';

const createPlaceholder = (text = String.fromCharCode(EMPTY_CHAR_CODE)): PlaceholderElement => ({
  type: ELEMENT_PLACEHOLDER,
  placeholder: 'Innfyllingsfelt',
  children: [{ text }],
});

const createP = (children: ParagraphElement['children']): ParagraphElement => ({
  type: BaseParagraphPlugin.key,
  align: TextAlign.LEFT,
  children,
});

const createText = (text: string) => ({ text });

const createEditor = (value: KabalValue, selection: Selection) =>
  createPlateEditor({ plugins: saksbehandlerPlugins, selection, value });

const createSelection = (point: Point): Selection => ({ anchor: point, focus: point });

const removeCharNTimes = (remove: (unit: TextUnit) => void, n: number) => {
  for (let i = 0; i < n; i++) {
    remove('character');
  }
};

describe('placeholder deleting', () => {
  describe('by character', () => {
    describe('from inside', () => {
      describe('with backspace', () => {
        it('should remove placeholder if empty', async () => {
          const children = [createP([createText('before '), createPlaceholder(), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 1, 0], offset: 1 }));

          editor.deleteBackward('character');

          expect(editor.children).toEqual([createP([createText('before  after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteBackward('character');

          expect(editor.children).toEqual([createP([createText('before after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 6 }));
        });

        it('should only remove character if placeholder is not empty', async () => {
          const children = [createP([createText('before '), createPlaceholder('placeholder'), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 1, 0], offset: 11 }));

          removeCharNTimes(editor.deleteBackward, 6);

          const expectedChildren1 = [
            createP([createText('before '), createPlaceholder('place'), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren1);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 5 }));

          editor.deleteBackward('character');

          const expectedChildren2 = [createP([createText('before '), createPlaceholder('plac'), createText(' after')])];
          expect(editor.children).toEqual(expectedChildren2);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 4 }));
        });
      });

      describe('delete', () => {
        it('should remove placeholder if empty', () => {
          const children = [createP([createText('before '), createPlaceholder(), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 1, 0], offset: 1 }));

          editor.deleteForward('character');

          expect(editor.children).toEqual([createP([createText('before  after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteForward('character');

          expect(editor.children).toEqual([createP([createText('before after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));
        });

        it('should only remove character if placeholder is not empty', () => {
          const children = [createP([createText('before '), createPlaceholder('placeholder'), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 1, 0], offset: 0 }));

          removeCharNTimes(editor.deleteForward, 5);

          const expectedChildren1 = [
            createP([createText('before '), createPlaceholder('holder'), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren1);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 0 }));

          editor.deleteForward('character');

          const expectedChildren2 = [
            createP([createText('before '), createPlaceholder('older'), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren2);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 0 }));
        });
      });
    });

    describe('from outside', () => {
      describe('backspace', () => {
        it('should remove placeholder if empty', () => {
          const children = [createP([createText('before '), createPlaceholder(), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 2], offset: 0 }));

          editor.deleteBackward('character');

          expect(editor.children).toEqual([createP([createText('before  after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteBackward('character');

          expect(editor.children).toEqual([createP([createText('before after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 6 }));
        });

        it('should remove characters inside placeholder if not empty and selection was right outside it', () => {
          const children = [createP([createText('before '), createPlaceholder('placeholder'), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 2], offset: 0 }));

          removeCharNTimes(editor.deleteBackward, 6);

          const expectedChildren1 = [
            createP([createText('before '), createPlaceholder('place'), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren1);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 5 }));

          editor.deleteBackward('character');

          const expectedChildren2 = [createP([createText('before '), createPlaceholder('plac'), createText(' after')])];
          expect(editor.children).toEqual(expectedChildren2);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 4 }));
        });
      });

      describe('delete', () => {
        it('should remove placeholder if empty', () => {
          const children = [createP([createText('before '), createPlaceholder(), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteForward('character');

          expect(editor.children).toEqual([createP([createText('before  after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteForward('character');

          expect(editor.children).toEqual([createP([createText('before after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));
        });

        it('should remove characters inside placeholder if not empty and selection was right outside it', () => {
          const children = [createP([createText('before '), createPlaceholder('placeholder'), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 0], offset: 7 }));

          removeCharNTimes(editor.deleteForward, 5);

          const expectedChildren1 = [
            createP([createText('before '), createPlaceholder('holder'), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren1);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 0 }));

          editor.deleteForward('character');

          const expectedChildren2 = [
            createP([createText('before '), createPlaceholder('older'), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren2);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 0 }));
        });
      });
    });
  });

  describe('by word', () => {
    describe('from inside', () => {
      describe('with backspace', () => {
        it('should remove placeholder if empty', async () => {
          const children = [createP([createText('before '), createPlaceholder(), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 1, 0], offset: 1 }));

          editor.deleteBackward('word');

          expect(editor.children).toEqual([createP([createText('before  after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteBackward('word');

          expect(editor.children).toEqual([createP([createText(' after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 0 }));
        });

        it('should only remove word if placeholder is not empty', async () => {
          const children = [
            createP([createText('before '), createPlaceholder('this is placeholder'), createText(' after')]),
          ];
          const editor = createEditor(children, createSelection({ path: [0, 1, 0], offset: 19 }));

          editor.deleteBackward('word');

          const expectedChildren1 = [
            createP([createText('before '), createPlaceholder('this is '), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren1);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 8 }));

          editor.deleteBackward('word');

          const expectedChildren2 = [
            createP([createText('before '), createPlaceholder('this '), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren2);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 5 }));
        });
      });

      describe('with delete', () => {
        it('should remove placeholder if empty', async () => {
          const children = [createP([createText('before '), createPlaceholder(), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 1, 0], offset: 1 }));

          editor.deleteForward('word');

          expect(editor.children).toEqual([createP([createText('before  after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteForward('word');

          expect(editor.children).toEqual([createP([createText('before ')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));
        });

        it('should only remove word if placeholder is not empty', async () => {
          const children = [
            createP([createText('before '), createPlaceholder('this is placeholder'), createText(' after')]),
          ];
          const editor = createEditor(children, createSelection({ path: [0, 1, 0], offset: 0 }));

          editor.deleteForward('word');

          const expectedChildren1 = [
            createP([createText('before '), createPlaceholder(' is placeholder'), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren1);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 0 }));

          editor.deleteForward('word');

          const expectedChildren2 = [
            createP([createText('before '), createPlaceholder(' placeholder'), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren2);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 0 }));
        });
      });
    });

    describe('from outside', () => {
      describe('backspace', () => {
        it('should remove placeholder if empty', () => {
          const children = [createP([createText('before '), createPlaceholder(), createText(' after')])];
          const editor = createEditor(children, createSelection({ path: [0, 2], offset: 0 }));

          editor.deleteBackward('word');

          expect(editor.children).toEqual([createP([createText('before  after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteBackward('word');

          expect(editor.children).toEqual([createP([createText(' after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 0 }));
        });

        it('should remove words inside placeholder if not empty and selection was right outside it', () => {
          const children = [
            createP([createText('before '), createPlaceholder('this is placeholder'), createText(' after')]),
          ];
          const editor = createEditor(children, createSelection({ path: [0, 2], offset: 0 }));

          editor.deleteBackward('word');

          const expectedChildren1 = [
            createP([createText('before '), createPlaceholder('this is '), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren1);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 8 }));

          editor.deleteBackward('word');

          const expectedChildren2 = [
            createP([createText('before '), createPlaceholder('this '), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren2);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 5 }));
        });
      });

      describe('delete', () => {
        it('should remove placeholder if empty', () => {
          const initialValue = [createP([createText('before '), createPlaceholder(), createText(' after')])];
          const editor = createEditor(initialValue, createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteForward('word');

          expect(editor.children).toEqual([createP([createText('before  after')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteForward('word');

          expect(editor.children).toEqual([createP([createText('before ')])]);
          expect(editor.selection).toEqual(createSelection({ path: [0, 0], offset: 7 }));
        });

        it('should remove words inside placeholder if not empty and selection was right outside it', () => {
          const children = [
            createP([createText('before '), createPlaceholder('this is placeholder'), createText(' after')]),
          ];
          const editor = createEditor(children, createSelection({ path: [0, 0], offset: 7 }));

          editor.deleteForward('word');

          const expectedChildren1 = [
            createP([createText('before '), createPlaceholder(' is placeholder'), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren1);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 0 }));

          editor.deleteForward('word');

          const expectedChildren2 = [
            createP([createText('before '), createPlaceholder(' placeholder'), createText(' after')]),
          ];
          expect(editor.children).toEqual(expectedChildren2);
          expect(editor.selection).toEqual(createSelection({ path: [0, 1, 0], offset: 0 }));
        });
      });
    });
  });
});
