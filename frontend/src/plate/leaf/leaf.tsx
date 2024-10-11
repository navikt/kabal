import { BOOKMARK_PREFIX, COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { type EditorValue, type RichText, type RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import {
  PlateLeaf,
  type PlateRenderLeafProps,
  findNodePath,
  getNodeAncestors,
  useEditorReadOnly,
} from '@udecode/plate-common';
import { useContext, useMemo, useRef } from 'react';

export const CustomLeaf = ({
  attributes,
  children,
  leaf,
  text,
}: Omit<PlateRenderLeafProps<EditorValue, RichText>, 'editor'>) => {
  const { setFocusedThreadId, focusedThreadId } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorRef();
  const isReadOnly = useEditorReadOnly();
  const ref = useRef<HTMLSpanElement>(null);

  const { threadIds, bookmarks } = useMetadata(leaf);

  const isCommentFocused = useMemo(
    () => focusedThreadId !== null && threadIds.includes(focusedThreadId),
    [focusedThreadId, threadIds],
  );

  const style = getCustomLeafStyles(leaf, isCommentFocused, threadIds.length);

  // Chromium Selection Fix: https://github.com/ianstormtaylor/slate/blob/main/site/examples/inlines.tsx#L347
  const paddingLeft = leaf.text.length === 0 ? 0.1 : undefined;

  return (
    <PlateLeaf
      editor={editor}
      attributes={attributes}
      leaf={leaf}
      text={text}
      ref={ref}
      style={{ ...style, color: bookmarks[0]?.color, paddingLeft }}
      contentEditable={contentEditable(editor, isReadOnly, text)}
      data-selected={leaf.selected}
      suppressContentEditableWarning
      onMouseDown={(e) => {
        e.stopPropagation();

        if (threadIds.length === 0) {
          return;
        }

        setTimeout(() => {
          setFocusedThreadId(threadIds.at(-1) ?? null);
        }, 50);
      }}
    >
      {children}
    </PlateLeaf>
  );
};

export const Leaf = ({
  attributes,
  children,
  leaf,
}: Omit<PlateRenderLeafProps<EditorValue, RichText>, 'editor' | 'text'>) => (
  <span {...attributes} style={getLeafStyles(leaf)}>
    {children}
  </span>
);

const useMetadata = (leaf: RichText) =>
  useMemo(() => {
    const _threadIds: string[] = [];
    const _bookmarks: { key: string; color: string }[] = [];

    const keys = Object.keys(leaf);

    for (const key of keys) {
      if (key.startsWith(COMMENT_PREFIX)) {
        _threadIds.push(key.replace(COMMENT_PREFIX, ''));
      } else if (key.startsWith(BOOKMARK_PREFIX)) {
        const bookmarkColor = leaf[key];

        if (typeof bookmarkColor === 'string') {
          _bookmarks.push({ key, color: bookmarkColor });
        }
      }
    }

    return { threadIds: _threadIds, bookmarks: _bookmarks };
  }, [leaf]);

const getCustomLeafStyles = (leaf: RichText, isActive: boolean, threadCount: number): React.CSSProperties => ({
  ...getLeafStyles(leaf),
  backgroundColor:
    leaf.selected === true ? 'var(--a-surface-success-subtle-hover)' : getBackgroundColor(threadCount, isActive),
});

const getLeafStyles = (leaf: RichText): React.CSSProperties => ({
  fontWeight: leaf.bold === true ? '600' : 'inherit',
  fontStyle: leaf.italic === true ? 'italic' : 'inherit',
  textDecoration: leaf.underline === true ? 'underline' : 'inherit',
  userSelect: 'text',
});

const contentEditable = (editor: RichTextEditor, isReadOnly: boolean, text: RichText): boolean => {
  if (isReadOnly) {
    return false;
  }

  const path = findNodePath(editor, text);

  if (path === undefined) {
    return false;
  }

  const ancestorEntries = getNodeAncestors(editor, path, { reverse: true });

  if (ancestorEntries === undefined) {
    return false;
  }

  for (const [node] of ancestorEntries) {
    if (node.type === ELEMENT_PLACEHOLDER) {
      return true;
    }

    if (node.type === ELEMENT_MALTEKST) {
      return false;
    }
  }

  return true;
};

const getBackgroundColor = (threadCount: number, isActive: boolean): React.CSSProperties['backgroundColor'] => {
  if (isActive) {
    return threadCount === 1 ? 'var(--a-green-200)' : 'var(--a-green-300)';
  }

  if (threadCount === 0) {
    return 'transparent';
  }

  if (threadCount === 1) {
    return 'var(--a-orange-100)';
  }

  return 'var(--a-orange-200)';
};
