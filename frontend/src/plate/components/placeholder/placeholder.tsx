import { TrashIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import {
  PlateEditor,
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  getNodeAncestors,
} from '@udecode/plate-common';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Path } from 'slate';
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
import { ELEMENT_MALTEKST } from '@app/plate/plugins/element-types';
import { EditorValue, MaltekstElement, PlaceholderElement } from '@app/plate/types';
import { isNodeEmpty, isOfElementType } from '@app/plate/utils/queries';

const placeholderIsOnlyChildInMaltekst = (
  editor: PlateEditor<EditorValue>,
  element: PlaceholderElement,
  path: Path | undefined,
) => {
  if (path === undefined) {
    return false;
  }

  const ancestors = getNodeAncestors(editor, path);

  for (const [node] of ancestors) {
    if (isOfElementType<MaltekstElement>(node, ELEMENT_MALTEKST)) {
      if (node.children.length !== 1) {
        return false;
      }

      const [child] = node.children;

      return child.children.every((c) => isNodeEmpty(editor, c) || c === element);
    }
  }

  return false;
};

export const Placeholder = ({
  element,
  children,
  attributes,
  editor,
}: PlateRenderElementProps<EditorValue, PlaceholderElement>) => {
  const path = findNodePath(editor, element);
  const text: string = useMemo(() => element.children.map((c) => c.text).join(''), [element.children]);
  const hasNoVisibleText = useMemo(() => getHasNoVisibleText(text), [text]);
  const isDragging = window.getSelection()?.isCollapsed === false;

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
    if (isDragging) {
      return;
    }

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
  }, [editor, element, isDragging, isFocused, path, text]);

  const deletePlaceholder = useCallback(() => {
    if (path === undefined) {
      return;
    }

    editor.delete({ at: path });
  }, [editor, path]);

  const hideDeleteButton = useMemo(
    () => placeholderIsOnlyChildInMaltekst(editor, element, path),
    [editor, element, path],
  );

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
        <Wrapper
          $placeholder={element.placeholder}
          $focused={isFocused}
          $hasText={!hasNoVisibleText}
          $hasButton={!hideDeleteButton}
          onClick={onClick}
        >
          {children}
          {hideDeleteButton ? null : (
            <DeleteButton title="Slett innfyllingsfelt" onClick={deletePlaceholder} contentEditable={false}>
              <TrashIcon aria-hidden />
            </DeleteButton>
          )}
        </Wrapper>
      </Tooltip>
    </PlateElement>
  );
};

interface WrapperStyleProps {
  $placeholder: string;
  $focused: boolean;
  $hasText: boolean;
  $hasButton: boolean;
}

const Wrapper = styled.span<WrapperStyleProps>`
  display: inline-block;
  background-color: ${({ $focused }) => getBackgroundColor($focused)};
  border-radius: var(--a-border-radius-medium);
  outline: none;
  color: #000;
  padding-left: ${({ $hasButton }) => ($hasButton ? '1em' : '0')};
  position: relative;

  &::after {
    cursor: text;
    color: var(--a-text-subtle);
    content: ${({ $hasText, $placeholder }) => ($hasText ? '""' : `"${$placeholder}"`)};
    user-select: none;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0;
  padding: 0;
  border-radius: var(--a-border-radius-medium);
  height: 1.333em;
  width: 1em;
  color: var(--a-text-danger);
  display: inline-flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;

  &:hover {
    background-color: var(--a-surface-neutral-subtle-hover);
  }

  &:active {
    background-color: var(--a-surface-neutral-active);
  }

  &:focus-visible {
    box-shadow:
      inset 0 0 0 2px var(--a-border-strong),
      var(--a-shadow-focus);
  }
`;

const getBackgroundColor = (focused: boolean) => (focused ? 'var(--a-blue-100)' : 'var(--a-gray-200)');
