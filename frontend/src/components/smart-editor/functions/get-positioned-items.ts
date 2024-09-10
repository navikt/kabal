import { findNode, isText } from '@udecode/plate-common';
import { FocusedComment } from '@app/components/smart-editor/comments/use-threads';
import { COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import { calculateRangePosition } from '@app/plate/functions/range-position';
import { RichText, RichTextEditor } from '@app/plate/types';

export enum ItemType {
  THREAD = 'thread',
  BOOKMARK = 'bookmark',
}

export interface BookmarkData {
  id: string;
  nodes: RichText[];
  type: ItemType.BOOKMARK;
}

export interface ThreadData extends FocusedComment {
  type: ItemType.THREAD;
}

export interface PositionedItem<T extends ThreadData | BookmarkData> {
  data: T;
  /** em */
  top: number;
  floorIndex: number;
}

const PREFIX_MAP = {
  [ItemType.THREAD]: COMMENT_PREFIX,
  [ItemType.BOOKMARK]: '',
};

interface Positioned<T extends ThreadData | BookmarkData> {
  positionedItems: PositionedItem<T>[];
  maxCount: number;
}

export const getPositionedItems = <T extends ThreadData | BookmarkData>(
  editor: RichTextEditor,
  list: T[],
  ref: HTMLElement | null,
): Positioned<T> => {
  const positionedItems = new Array<PositionedItem<T>>(list.length);
  const { length } = list;
  let maxCount = 0;

  for (let i = 0; i < length; i++) {
    const item = list[i]!;

    const leafEntry = findNode(editor, {
      at: [],
      match: (n) => isText(n) && Object.keys(n).some((k) => k.startsWith(`${PREFIX_MAP[item.type]}${item.id}`)),
    });

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

    if (item.type === ItemType.BOOKMARK) {
      positionedItems[i] = { data: item, top, floorIndex };
    } else {
      positionedItems[i] = { data: item, top, floorIndex };
    }
  }

  return { positionedItems, maxCount };
};
