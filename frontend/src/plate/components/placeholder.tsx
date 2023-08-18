import { Tooltip } from '@navikt/ds-react';
import {
  PlateElement,
  PlateRenderElementProps,
  TPath,
  findNode,
  insertNodes,
  insertText,
  isCollapsed,
  removeNodes,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Path } from 'slate';
import { styled } from 'styled-components';
import { EditorValue, PlaceholderElement, RichText, RichTextEditor } from '@app/plate/types';

const EMPTY_CHAR_CODE = 8203;
const EMPTY_CHAR = String.fromCharCode(EMPTY_CHAR_CODE); // \u200b

export const Placeholder = ({
  element,
  children,
  attributes,
  editor,
}: PlateRenderElementProps<EditorValue, PlaceholderElement>) => {
  const hasNoVisibleText = getHasNoVisibleText(element.children);

  const entry = useMemo(
    () =>
      findNode<PlaceholderElement>(editor, {
        at: [],
        match: (n) => n === element,
        voids: false,
      }),
    [editor, element],
  );

  const [node, path] = entry ?? [undefined, undefined];
  const text: string = node?.children.map((c) => c.text).join('') ?? '';

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

    // Undo (Ctrl + Z) causes the placeholder to contain two empty chars. This cleans that up.
    if (text.length > 1 && containsOnlyEmptyChar(element.children)) {
      withoutSavingHistory(editor, () => {
        withoutNormalizing(editor, () => {
          removeNodes(editor, {
            at: path,
            match: (n) => n !== element,
          });

          insertNodes<RichText>(editor, { text: EMPTY_CHAR }, { at });
        });
      });
    }

    if (!isFocused && hasNoText(element.children)) {
      withoutSavingHistory(editor, () => {
        withoutNormalizing(editor, () => {
          insertText(editor, EMPTY_CHAR, { at });
        });
      });

      return;
    }

    if (isFocused && isCollapsed(editor.selection) && containsEmptyChar(element.children) && text.length === 1) {
      const cleanText: RichText[] = element.children.map((c) => ({
        ...c,
        text: c.text
          .split('')
          .filter((ch) => ch.charCodeAt(0) !== EMPTY_CHAR_CODE)
          .join(''),
      }));

      withoutSavingHistory(editor, () => {
        withoutNormalizing(editor, () => {
          removeNodes(editor, {
            at: path,
            match: (n) => n !== element,
          });
          insertNodes<RichText>(editor, cleanText, { at, select: true });
        });
      });
    }
  }, [editor, element, entry, isFocused, path, text.length]);

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

const getHasNoVisibleText = (texts: RichText[]): boolean =>
  texts.every((t) => t.text.length === 0 || t.text === EMPTY_CHAR);

const hasNoText = (texts: RichText[]): boolean => texts.every((t) => t.text.length === 0);

const containsEmptyChar = (texts: RichText[]): boolean => texts.some((t) => t.text.includes(EMPTY_CHAR));
const containsOnlyEmptyChar = (texts: RichText[]): boolean => texts.every((t) => t.text.includes(EMPTY_CHAR));

const getIsFocused = (editor: RichTextEditor, path: TPath): boolean => {
  if (editor.selection === null) {
    return false;
  }

  return Path.isParent(path, editor.selection.focus.path);
};

interface WrapperStyleProps {
  $placeholder: string;
  $focused: boolean;
  $hasText: boolean;
}

const Anchor = styled.span`
  font-size: 0;
`;

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
