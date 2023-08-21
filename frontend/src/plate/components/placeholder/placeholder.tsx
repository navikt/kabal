import { Tooltip } from '@navikt/ds-react';
import { PlateElement, PlateRenderElementProps, findNodePath } from '@udecode/plate-common';
import React, { useCallback, useEffect, useMemo } from 'react';
import { styled } from 'styled-components';
import {
  cleanText,
  containsEmptyChar,
  containsMultipleEmptyCharAndNoText,
  ensureOnlyOneEmptyChar,
  getHasNoVisibleText,
  getIsFocused,
  hasZeroChars,
  insertEmptyChar,
} from '@app/plate/components/placeholder/helpers';
import { EditorValue, PlaceholderElement } from '@app/plate/types';

export const Placeholder = ({
  element,
  children,
  attributes,
  editor,
}: PlateRenderElementProps<EditorValue, PlaceholderElement>) => {
  const path = findNodePath(editor, element);
  const text: string = useMemo(() => element.children.map((c) => c.text).join(''), [element.children]);
  const hasNoVisibleText = useMemo(() => getHasNoVisibleText(text), [text]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (!hasNoVisibleText) {
        return;
      }

      if (path === undefined) {
        return;
      }

      e.preventDefault();

      editor.select({ path: [...path, 0], offset: 0 });
    },
    [editor, hasNoVisibleText, path],
  );

  const isFocused = path === undefined ? false : getIsFocused(editor, path);

  useEffect(() => {
    if (path === undefined) {
      return;
    }

    const at = [...path, 0];

    if (!editor.hasPath(at)) {
      return;
    }

    // Multiple empty chars.                    -> One empty char.
    // Focus + Contains only text.              -> Nothing to do.
    // Focus + Contains only empty chars.       -> One empty char.
    // Focus + Contains empty chars and text.   -> Only text.
    // Focus + Completely empty placeholder.    -> One empty char.
    // No focus + Completely empty placeholder. -> One empty char.

    // Undo (Ctrl + Z) causes the placeholder to contain two empty chars. This cleans that up.
    if (containsMultipleEmptyCharAndNoText(text)) {
      ensureOnlyOneEmptyChar(editor, element, path, at);
    }

    if (isFocused) {
      // Only text.
      if (!containsEmptyChar(text)) {
        return;
      }

      return cleanText(editor, element, path, at);
    }

    if (hasZeroChars(text)) {
      return insertEmptyChar(editor, path, at);
    }
  }, [editor, element, isFocused, path, text]);

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable
      suppressContentEditableWarning
    >
      <Tooltip content={element.placeholder} maxChar={Infinity} contentEditable={false}>
        <Wrapper $placeholder={element.placeholder} $focused={isFocused} $hasText={!hasNoVisibleText} onClick={onClick}>
          <Anchor contentEditable={false} />
          {children}
          <Anchor contentEditable={false} />
        </Wrapper>
      </Tooltip>
    </PlateElement>
  );
};

const Anchor = styled.span`
  font-size: 0;
`;

interface WrapperStyleProps {
  $placeholder: string;
  $focused: boolean;
  $hasText: boolean;
}

const Wrapper = styled.span<WrapperStyleProps>`
  display: inline-block;
  background-color: ${({ $focused }) => getBackgroundColor($focused)};
  border-radius: var(--a-border-radius-medium);
  outline: none;
  color: #000;

  &::after {
    cursor: text;
    color: var(--a-text-subtle);
    content: ${({ $hasText, $placeholder }) => ($hasText ? '""' : `"${$placeholder}"`)};
  }
`;

const getBackgroundColor = (focused: boolean) => (focused ? 'var(--a-blue-100)' : 'var(--a-gray-200)');
