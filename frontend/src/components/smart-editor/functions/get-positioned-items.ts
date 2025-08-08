import type { Bookmark } from '@app/components/smart-editor/bookmarks/use-bookmarks';
import type { FocusedComment } from '@app/components/smart-editor/comments/use-threads';
import { calculateRangePosition } from '@app/plate/functions/range-position';
import type { RichTextEditor } from '@app/plate/types';
import { TextApi } from 'platejs';

export enum ItemType {
  THREAD = 'thread',
  BOOKMARK = 'bookmark',
}

export interface PositionedItem<T extends FocusedComment | Bookmark> {
  data: T;
  /** em */
  top: number;
  floorIndex: number;
}

interface Positioned<T extends FocusedComment | Bookmark> {
  positionedItems: PositionedItem<T>[];
  maxCount: number;
}

export interface ItemToPosition<T> {
  key: string;
  data: T;
}

export const getPositionedItems = <T extends FocusedComment | Bookmark>(
  editor: RichTextEditor,
  list: ItemToPosition<T>[],
  ref: HTMLElement | null,
): Positioned<T> => {
  const positionedItems = new Array<PositionedItem<T>>(list.length);
  const { length } = list;
  let maxCount = 0;

  for (let i = 0; i < length; i++) {
    const item = list[i];

    if (item === undefined) {
      continue;
    }

    const leafEntry = editor.api.node({ at: [], match: (n) => TextApi.isText(n) && Object.hasOwn(n, item.key) });

    if (leafEntry === undefined) {
      continue;
    }

    const [, path] = leafEntry;

    // Distance from top in em.
    const top: number | null =
      ref === null ? null : (calculateRangePosition(editor, ref, { path, offset: 0 })?.top ?? null);

    if (top === null) {
      continue;
    }

    const floorIndex = positionedItems.filter((t) => t.top === top).length;

    if (floorIndex >= maxCount) {
      maxCount = floorIndex + 1;
    }

    positionedItems[i] = { data: item.data, top, floorIndex };
  }

  return { positionedItems, maxCount };
};
