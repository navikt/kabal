import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { type BookmarkVariantEnum, isBookmarkVariant } from '@app/plate/toolbar/bookmark-button';
import { type FormattedText, useMyPlateEditorState } from '@app/plate/types';
import { TextApi } from 'platejs';

export interface Bookmark {
  /** The key in the document structure. The value of this key is the variant. */
  key: string;
  /** The variant of the bookmark. The value of the key property in the document structure.
   * @example node[key] === variant
   * */
  variant: BookmarkVariantEnum;
  nodes: FormattedText[];
}

export const useBookmarks = (): Bookmark[] => {
  const editor = useMyPlateEditorState();

  const bookmarkEntries = editor.nodes<FormattedText>({
    match: (n) => TextApi.isText(n) && Object.keys(n).some((k) => k.startsWith(BOOKMARK_PREFIX)),
    at: [],
  });

  const bookmarkMap: Map<string, Bookmark> = new Map();

  for (const [node] of bookmarkEntries) {
    const keys = Object.entries(node).filter(([k]) => k.startsWith(BOOKMARK_PREFIX));

    for (const [key, variant] of keys) {
      const existing = bookmarkMap.get(key);

      if (typeof variant !== 'string' || !isBookmarkVariant(variant)) {
        continue;
      }

      bookmarkMap.set(key, {
        variant,
        key,
        nodes: existing !== undefined ? [...existing.nodes, node] : [node],
      });
    }
  }

  if (bookmarkMap.size === 0) {
    return EMPTY_BOOKMARKS;
  }

  return [...bookmarkMap.values()];
};

const EMPTY_BOOKMARKS: Bookmark[] = [];
