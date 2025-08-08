import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { type BookmarkVariantEnum, isBookmarkVariant } from '@app/plate/toolbar/bookmark-button';
import { type FormattedText, useMyPlateEditorState } from '@app/plate/types';
import { TextApi } from 'platejs';

export interface Bookmark {
  /** The key in the document structure.
   * @example `{ bookmark_1754674866743: "1", ...other_leaf_node_properties }`
   * The key, ex. `bookmark_1754674866743`, is the unique bookmark property on the leaf node.
   * The key prefix `bookmark_` is used to distinguish bookmark keys from other keys on leaf nodes, like comments and marks.
   * The key suffix `1754674866743` is timestamp for this bookmark. It could be any unique identifier.
   * The value, `"1"`, is the variant of the bookmark. And is of the type `BookmarkVariantEnum`.
   */
  key: string;
  /** The variant of the bookmark. The value of the key property in the document structure.
   * @example `node[key] === variant`
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
