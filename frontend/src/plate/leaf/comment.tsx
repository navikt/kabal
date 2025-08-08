import { COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import type { FormattedText } from '@app/plate/types';
import { PlateLeaf, type PlateLeafProps } from 'platejs/react';
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
      className={getCommentClasses(commentIds.length > 0, isCommentFocused)}
      data-selected={leaf.selected}
      attributes={{
        ...props.attributes,
        suppressContentEditableWarning: true,
        onMouseDown: (e) => {
          e.stopPropagation();

          if (commentIds.length === 0) {
            return;
          }

          setTimeout(() => {
            setFocusedThreadId(commentIds.at(-1) ?? null);
          }, 50);
        },
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

const getCommentClasses = (hasComment: boolean, isFocused: boolean): string | undefined => {
  if (isFocused) {
    return /* @tw */ 'bg-ax-bg-warning-moderate-pressed underline underline-offset-2 decoration-ax-border-warning-strong decoration-4 rounded-sm';
  }

  if (hasComment) {
    return /* @tw */ 'bg-ax-bg-warning-moderate hover:bg-ax-bg-warning-moderate-hover underline underline-offset-2 decoration-ax-border-warning-strong decoration-2 rounded-sm';
  }

  return undefined;
};
