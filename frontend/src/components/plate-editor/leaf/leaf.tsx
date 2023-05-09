import {
  PlateRenderLeafProps,
  getCommentKeyId,
  isCommentKey,
  useCommentsActions,
  useCommentsSelectors,
} from '@udecode/plate';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { EditorValue, RichText, TextAlign } from '../types';

export const CustomLeaf = ({ attributes, children, leaf }: Omit<PlateRenderLeafProps<EditorValue>, 'editor'>) => {
  const [commentIds, setCommentIds] = useState<string[]>([]);
  const activeCommentId = useCommentsSelectors().activeCommentId();
  const setActiveCommentId = useCommentsActions().activeCommentId();
  const comments = useCommentsSelectors().comments();
  const [commentCount, setCommentCount] = useState(1);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const ids: string[] = [];
    let count = 0;

    let _isActive = false;

    Object.keys(leaf).forEach((key) => {
      if (!isCommentKey(key)) {
        return;
      }

      const id = getCommentKeyId(key);

      if (comments[id]?.isResolved === true) {
        return;
      }

      if (id === activeCommentId) {
        _isActive = true;
        setIsActive(true);
      }

      ids.push(getCommentKeyId(key));
      count++;
    });

    if (!_isActive && isActive) {
      setIsActive(false);
    }

    setCommentCount(count);
    setCommentIds(ids);
  }, [activeCommentId, comments, isActive, leaf]);

  const lastCommentId: string | null = commentIds[commentIds.length - 1] ?? null;

  return (
    <StyledLeaf
      {...attributes}
      {...leaf}
      $commentCount={commentCount}
      $isActive={isActive}
      onMouseDown={(e: MouseEvent) => {
        e.stopPropagation();
        setActiveCommentId(lastCommentId);
      }}
    >
      {children}
    </StyledLeaf>
  );
};

const getTextDecoration = ({ underline, strikethrough }: RichText) => {
  if (underline === true && strikethrough === true) {
    return 'underline strikethrough';
  }

  if (underline === true) {
    return 'underline';
  }

  if (strikethrough === true) {
    return 'line-through';
  }

  return 'none';
};

const getScriptDecoration = ({ subscript, superscript }: RichText) => {
  if (superscript === true) {
    return 'super';
  }

  if (subscript === true) {
    return 'sub';
  }

  return 'unset';
};

const getFontSize = ({ subscript, superscript }: RichText) =>
  subscript === true || superscript === true ? 'smaller' : 'unset';

const getColor = (comments: number, isActive: boolean) => {
  if (isActive === true) {
    return `var(--a-surface-warning-subtle-hover)`;
  }

  if (comments === 0) {
    return 'none';
  }

  return `var(--a-surface-warning-subtle)`;

  // const lightness = 100 - 15 * Math.min(comments, 3);
  // const hue = focused ? 0 : 38;
  // const saturation = focused ? 75 : 50;

  // return `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;
};

// const getCaretColor = (selected: boolean, isExpanded: boolean) =>
//   selected && !isExpanded ? 'var(--a-text-default)' : 'transparent';

interface StyledLeafProps extends RichText {
  $commentCount: number;
  $isActive: boolean;
}

const StyledLeaf = styled.span<StyledLeafProps>`
  font-weight: ${({ bold }) => (bold === true ? '700' : 'auto')};
  font-style: ${({ italic }) => (italic === true ? 'italic' : 'normal')};
  font-size: ${getFontSize};
  text-decoration: ${getTextDecoration};
  vertical-align: ${getScriptDecoration};
  background-color: ${({ $isActive, $commentCount }) => getColor($commentCount, $isActive)};
`;
