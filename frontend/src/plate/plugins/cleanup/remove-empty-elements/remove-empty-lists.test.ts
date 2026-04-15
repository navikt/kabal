import { describe, expect, it } from 'bun:test';
import { BaseBulletedListPlugin, BaseListItemPlugin } from '@platejs/list-classic';
import { ListPlugin } from '@platejs/list-classic/react';
import { createPlateEditor } from 'platejs/react';
import { removeEmptyElements } from '@/plate/plugins/cleanup/remove-empty-elements/remove-empty-elements';
import {
  createSimpleBulletList,
  createSimpleListItemContainer,
  createSimpleParagraph,
} from '@/plate/templates/helpers';
import type { BulletListElement, ListItemElement } from '@/plate/types';

describe('removeEmptyElements', () => {
  describe('list items', () => {
    it('should remove an empty list item from a list', () => {
      const editor = createEditorWithLists(createSimpleBulletList('item 1', '', 'item 2'));
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleBulletList('item 1', 'item 2')]);
    });

    it('should remove multiple empty list items', () => {
      const editor = createEditorWithLists(createSimpleBulletList('item 1', '', '', 'item 2'));
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleBulletList('item 1', 'item 2')]);
    });

    it('should remove the entire list if all items are empty', () => {
      const editor = createEditorWithLists(
        createSimpleParagraph('before'),
        createSimpleBulletList('', ''),
        createSimpleParagraph('after'),
      );
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleParagraph('before'), createSimpleParagraph('after')]);
    });

    it('should not remove non-empty list items', () => {
      const editor = createEditorWithLists(createSimpleBulletList('item 1', 'item 2'));
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleBulletList('item 1', 'item 2')]);
    });

    it('should handle a list with one empty item among content', () => {
      const editor = createEditorWithLists(createSimpleBulletList('first', '', 'last'));
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleBulletList('first', 'last')]);
    });

    it('should not affect paragraphs', () => {
      const editor = createEditorWithLists(createSimpleParagraph('hello'), createSimpleBulletList('', 'keep'));
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleParagraph('hello'), createSimpleBulletList('keep')]);
    });

    it('should only remove empty list items within the given range', () => {
      const editor = createEditorWithLists(
        createSimpleBulletList('', 'first'),
        createSimpleParagraph('middle'),
        createSimpleBulletList('', 'second'),
      );
      const at = { anchor: { path: [1, 0], offset: 0 }, focus: { path: [2, 1, 0, 0], offset: 6 } };
      removeEmptyElements(editor, at);
      expect(editor.children).toEqual([
        createSimpleBulletList('', 'first'),
        createSimpleParagraph('middle'),
        createSimpleBulletList('second'),
      ]);
    });

    it('should not remove the empty list item the caret is in', () => {
      const editor = createEditorWithLists(createSimpleBulletList('', 'item', ''));
      // Caret is in the text node of the first empty list item. List > ListItem > ListItemContent > Text = [0, 0, 0, 0].
      removeEmptyElements(editor, [], [0, 0, 0, 0]);
      expect(editor.children).toEqual([createSimpleBulletList('', 'item')]);
    });

    it('should preserve list items that have nested sublists even if the item text is empty', () => {
      const parentWithNested = createListItemWithNestedList('nested 1', 'nested 2');
      const editor = createPlateEditor({
        plugins: [ListPlugin],
        value: [createBulletListWithItems(parentWithNested)],
      });
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createBulletListWithItems(parentWithNested)]);
    });

    it('should remove nested empty list items inside a sublist', () => {
      const parentWithEmptyNested = createListItemWithNestedList('');
      const editor = createPlateEditor({
        plugins: [ListPlugin],
        value: [createSimpleParagraph('Document is never empty'), createBulletListWithItems(parentWithEmptyNested)],
      });
      removeEmptyElements(editor);
      expect(editor.children).toEqual([createSimpleParagraph('Document is never empty')]);
    });
  });
});

const createEditorWithLists = (
  ...children: ReturnType<typeof createSimpleParagraph | typeof createSimpleBulletList>[]
) =>
  createPlateEditor({
    plugins: [ListPlugin],
    value: children,
  });

/** Create a list item with empty text content but a nested sublist. */
const createListItemWithNestedList = (...nestedItems: string[]): ListItemElement => ({
  type: BaseListItemPlugin.key,
  children: [
    createSimpleListItemContainer(''),
    createSimpleBulletList(...nestedItems),
  ] as unknown as ListItemElement['children'],
});

/** Create a bullet list mixing regular items and pre-built list items. */
const createBulletListWithItems = (...items: ListItemElement[]): BulletListElement => ({
  type: BaseBulletedListPlugin.key,
  indent: 2,
  children: items,
});
