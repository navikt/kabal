import { TrashIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import {
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  focusEditor,
  useEditorReadOnly,
} from '@udecode/plate-common';
import React, { MouseEvent, useCallback, useEffect, useMemo } from 'react';
import {
  cleanText,
  containsEmptyChar,
  containsMultipleEmptyCharAndNoText,
  ensureOnlyOneEmptyChar,
  getHasNoVisibleText,
  getIsFocused,
  hasZeroChars,
  insertEmptyChar,
  lonePlaceholderInMaltekst,
} from '@app/plate/components/placeholder/helpers';
import { DeleteButton, Wrapper } from '@app/plate/components/placeholder/styled-components';
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
  const isReadOnly = useEditorReadOnly();
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

  const deletePlaceholder = useCallback(
    (event: MouseEvent) => {
      if (path === undefined) {
        return;
      }

      event.stopPropagation();

      editor.delete({ at: path });
      focusEditor(editor);
    },
    [editor, path],
  );

  const hideDeleteButton = useMemo(
    () => !hasNoVisibleText || lonePlaceholderInMaltekst(editor, element, path),
    [editor, element, hasNoVisibleText, path],
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
            <DeleteButton
              title="Slett innfyllingsfelt"
              onClick={deletePlaceholder}
              contentEditable={false}
              disabled={isReadOnly}
            >
              <TrashIcon aria-hidden />
            </DeleteButton>
          )}
        </Wrapper>
      </Tooltip>
    </PlateElement>
  );
};
