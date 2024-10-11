import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { type RichText, useMyPlateEditorState } from '@app/plate/types';
import { isText } from '@udecode/plate-common';

export const useBookmarks = (): [string, RichText[]][] => {
  const editor = useMyPlateEditorState();

  const bookmarkEntries = editor.nodes<RichText>({
    match: (n) => isText(n) && Object.keys(n).some((k) => k.startsWith(BOOKMARK_PREFIX)),
    at: [],
  });

  const bookmarkMap: Map<string, RichText[]> = new Map();

  for (const [node] of bookmarkEntries) {
    const keys = Object.keys(node).filter((k) => k.startsWith(BOOKMARK_PREFIX));

    for (const key of keys) {
      const existing = bookmarkMap.get(key);
      bookmarkMap.set(key, existing !== undefined ? [...existing, node] : [node]);
    }
  }

  if (bookmarkMap.size === 0) {
    return EMPTY_BOOKMARKS;
  }

  return [...bookmarkMap.entries()];
};

const EMPTY_BOOKMARKS: [string, RichText[]][] = [];
