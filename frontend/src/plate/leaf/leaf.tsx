import { PlateLeaf, PlateRenderLeafProps, findNodePath, getNodeAncestors } from '@udecode/plate-common';
import React, { useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { EditorValue, RichText, RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';

export const CustomLeaf = ({
  attributes,
  children,
  leaf,
  text,
}: Omit<PlateRenderLeafProps<EditorValue, RichText>, 'editor'>) => {
  const { setFocusedThreadId, focusedThreadId } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorRef();
  const ref = useRef<HTMLSpanElement>(null);

  const threadIds = useMemo(() => {
    const ids: string[] = [];

    Object.keys(leaf).forEach((key) => {
      if (!key.startsWith(COMMENT_PREFIX)) {
        return;
      }

      ids.push(key.replace(COMMENT_PREFIX, ''));
    });

    return ids;
  }, [leaf]);

  const isActive = useMemo(
    () => focusedThreadId !== null && threadIds.includes(focusedThreadId),
    [focusedThreadId, threadIds],
  );

  useLayoutEffect(() => {
    if (isActive && ref.current !== null) {
      requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: 'auto', block: 'center' }));
    }
  }, [isActive]);

  return (
    <PlateLeaf
      editor={editor}
      attributes={attributes}
      leaf={leaf}
      text={text}
      ref={ref}
      style={getCustomLeafStyles(leaf, isActive, threadIds.length)}
      contentEditable={contentEditable(editor, text)}
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

const getCustomLeafStyles = (leaf: RichText, isActive: boolean, threadCount: number): React.CSSProperties => ({
  backgroundColor: leaf.selected === true ? 'var(--a-surface-success-subtle-hover)' : getColor(threadCount, isActive),
  ...getLeafStyles(leaf),
});

const getLeafStyles = (leaf: RichText): React.CSSProperties => ({
  fontWeight: leaf.bold === true ? '600' : 'inherit',
  fontStyle: leaf.italic === true ? 'italic' : 'inherit',
  textDecoration: leaf.underline === true ? 'underline' : 'inherit',
  userSelect: 'text',
});

const contentEditable = (editor: RichTextEditor, text: RichText): boolean => {
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

const getColor = (commentCount: number, isActive: boolean): React.CSSProperties['backgroundColor'] => {
  if (isActive) {
    return commentCount === 1 ? 'var(--a-green-200)' : 'var(--a-green-300)';
  }

  if (commentCount === 0) {
    return 'transparent';
  }

  if (commentCount === 1) {
    return 'var(--a-orange-100)';
  }

  return 'var(--a-orange-200)';
};
