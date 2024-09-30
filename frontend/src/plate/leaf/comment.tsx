import { COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import type { FormattedText } from '@app/plate/types';
import { PlateLeaf, type PlateLeafProps } from '@udecode/plate-common/react';
import { useContext, useMemo } from 'react';

export const CommentLeaf = (props: PlateLeafProps<FormattedText>) => {
  const { children, leaf } = props;
  const { setFocusedThreadId, focusedThreadId } = useContext(SmartEditorContext);

  const commentIds = useCommentIds(leaf);

  const isCommentFocused = useMemo(
    () => focusedThreadId !== null && commentIds.includes(focusedThreadId),
    [focusedThreadId, commentIds],
  );

  return (
    <PlateLeaf
      {...props}
      style={{
        backgroundColor:
          leaf.selected === true
            ? 'var(--a-surface-success-subtle-hover)'
            : getBackgroundColor(commentIds.length, isCommentFocused),
      }}
      data-selected={leaf.selected}
      suppressContentEditableWarning
      onMouseDown={(e) => {
        e.stopPropagation();

        if (commentIds.length === 0) {
          return;
        }

        setTimeout(() => {
          setFocusedThreadId(commentIds.at(-1) ?? null);
        }, 50);
      }}
    >
      {children}
    </PlateLeaf>
  );
};

const useCommentIds = (leaf: FormattedText) =>
  useMemo(() => {
    const commentIds: string[] = [];

    const keys = Object.keys(leaf);

    for (const key of keys) {
      if (key.startsWith(COMMENT_PREFIX)) {
        commentIds.push(key.replace(COMMENT_PREFIX, ''));
      }
    }

    return commentIds;
  }, [leaf]);

const getBackgroundColor = (commentCount: number, isCommentActive: boolean): React.CSSProperties['backgroundColor'] => {
  if (isCommentActive) {
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
