import {
  deleteText,
  findNode,
  findNodePath,
  insertNodes,
  insertText,
  isCollapsed,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate';
import { PlateRenderElementProps } from '@udecode/plate-core';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { isGenericObject } from '@app/types/types';
import { EditorValue, PlaceholderElement, RichText, RichTextEditor } from '../types';

const isChromium = isGenericObject(window) && typeof window['chrome'] !== 'undefined';

const EMPTY_CHAR = `\u200b`;

export const Placeholder = ({
  element,
  children,
  attributes,
  editor,
}: PlateRenderElementProps<EditorValue, PlaceholderElement>) => {
  const isEmptyVisibly = hasNoVisibleText(element.children);

  const onClick = (e: React.MouseEvent) => {
    if (!isEmptyVisibly) {
      return;
    }

    const path = findNodePath(editor, element);

    if (path === undefined) {
      return;
    }

    e.preventDefault();
    editor.select({ path: [...path, 0], offset: 0 });
  };

  const isFocused = getIsFocused(editor, element);

  useEffect(() => {
    const path = findNodePath(editor, element);

    if (path === undefined) {
      return;
    }

    if (!isFocused && hasNoText(element.children)) {
      const at = [...path, 0];

      withoutSavingHistory(editor, () => {
        withoutNormalizing(editor, () => {
          insertText(editor, EMPTY_CHAR, { at });
        });
      });

      return;
    }

    if (isFocused && isCollapsed(editor.selection) && containsEmptyChar(element.children)) {
      const cleanText = element.children.map((c) => ({ ...c, text: c.text.replaceAll(EMPTY_CHAR, '') }));
      const at = [...path, 0];

      withoutSavingHistory(editor, () => {
        withoutNormalizing(editor, () => {
          deleteText(editor, { at });
          insertNodes<RichText>(editor, cleanText, { at, select: true });
        });
      });
    }
  }, [editor, element, isFocused]);

  if (isChromium) {
    return (
      <Wrapper
        {...attributes}
        title={element.placeholder}
        $placeholder={element.placeholder}
        $focused={getIsFocused(editor, element)}
        $hasText={!isEmptyVisibly}
        onClick={onClick}
      >
        <Anchor contentEditable={false} role="presentation">
          {EMPTY_CHAR}
        </Anchor>
        {children}
        <Anchor contentEditable={false} role="presentation">
          {EMPTY_CHAR}
        </Anchor>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...attributes}
      title={element.placeholder}
      $placeholder={element.placeholder}
      $focused={getIsFocused(editor, element)}
      $hasText={!isEmptyVisibly}
      onClick={onClick}
    >
      {children}
    </Wrapper>
  );
};

const hasNoVisibleText = (texts: RichText[]): boolean =>
  texts.every((t) => t.text.length === 0 || t.text.includes(EMPTY_CHAR));

const hasNoText = (texts: RichText[]): boolean => texts.every((t) => t.text.length === 0);

const containsEmptyChar = (texts: RichText[]): boolean => texts.some((t) => t.text.includes(EMPTY_CHAR));

const getIsFocused = (editor: RichTextEditor, element: PlaceholderElement): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const node = findNode<PlaceholderElement>(editor, { at: editor.selection, match: (n) => n === element });

  return node !== undefined;
};

interface WrapperProps {
  $placeholder: string;
  $focused: boolean;
  $hasText: boolean;
}

const Wrapper = styled.span<WrapperProps>`
  background-color: ${({ $focused }) => getBackgroundColor($focused)};
  border-radius: 4px;
  outline: none;
  color: #000;

  ::after {
    cursor: text;
    color: var(--a-text-subtle);
    content: ${({ $hasText, $placeholder }) => ($hasText ? '""' : `"${$placeholder}"`)};
  }
`;

const getBackgroundColor = (focused: boolean) => (focused ? 'var(--a-blue-100)' : 'var(--a-gray-200)');

const Anchor = styled.span`
  font-size: 0;
`;
