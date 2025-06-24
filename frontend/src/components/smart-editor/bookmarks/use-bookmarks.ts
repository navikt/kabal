import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { type FormattedText, useMyPlateEditorState } from '@app/plate/types';
import { TextApi } from 'platejs';

export const useBookmarks = (): [string, FormattedText[]][] => {
  const editor = useMyPlateEditorState();

  const bookmarkEntries = editor.nodes<FormattedText>({
    match: (n) => TextApi.isText(n) && Object.keys(n).some((k) => k.startsWith(BOOKMARK_PREFIX)),
    at: [],
  });

  const bookmarkMap: Map<string, FormattedText[]> = new Map();

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

const EMPTY_BOOKMARKS: [string, FormattedText[]][] = [];
