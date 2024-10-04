import { TrashIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import {
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  focusEditor,
  useEditorReadOnly,
} from '@udecode/plate-common';
import { MouseEvent, useCallback, useContext, useEffect, useMemo } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { removeEmptyCharInText } from '@app/functions/remove-empty-char-in-text';
import {
  cleanText,
  containsMultipleEmptyCharAndNoText as containsMultipleEmptyChars,
  ensureOnlyOneEmptyChar,
  getContainsEmptyChar,
  getHasNoVisibleText,
  getHasZeroChars,
  getIsFocused,
  insertEmptyChar,
  lonePlaceholderInMaltekst,
} from '@app/plate/components/placeholder/helpers';
import { DeleteButton, Wrapper } from '@app/plate/components/placeholder/styled-components';
import { EditorValue, PlaceholderElement } from '@app/plate/types';

export const RedaktørPlaceholder = (props: PlateRenderElementProps<EditorValue, PlaceholderElement>) => (
  <Placeholder {...props} canManage />
);

export const PreviewPlaceholder = (props: PlateRenderElementProps<EditorValue, PlaceholderElement>) => (
  <Placeholder {...props} canManage={false} />
);

export const SaksbehandlerPlaceholder = (props: PlateRenderElementProps<EditorValue, PlaceholderElement>) => {
  const { canManage } = useContext(SmartEditorContext);

  return <Placeholder {...props} canManage={canManage} />;
};

interface PlaceholderProps extends PlateRenderElementProps<EditorValue, PlaceholderElement> {
  canManage: boolean;
}

const Placeholder = ({ element, children, attributes, editor, canManage }: PlaceholderProps) => {
  const path = findNodePath(editor, element);
  const text: string = useMemo(() => element.children.map((c) => c.text).join(''), [element.children]);
  const hasNoVisibleText = useMemo(() => getHasNoVisibleText(text), [text]);
  const isReadOnly = useEditorReadOnly();
  const isDragging = window.getSelection()?.isCollapsed === false;
  const containsEmptyChar = getContainsEmptyChar(text);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (!hasNoVisibleText) {
        return;
      }

      if (path === undefined) {
        return;
      }

      e.preventDefault();

      editor.select({ path: [...path, 0], offset: containsEmptyChar ? 1 : 0 });
    },
    [containsEmptyChar, editor, hasNoVisibleText, path],
  );

  const isFocused = path === undefined ? false : getIsFocused(editor, path);

  useEffect(() => {
    if (isDragging || path === undefined) {
      return;
    }

    const at = [...path, 0];

    if (!editor.hasPath(at)) {
      return;
    }

    // Contains only text.              -> Nothing to do.
    // Contains only empty chars.       -> One empty char.
    // Contains empty chars and text.   -> Only text.
    // Completely empty placeholder.    -> One empty char.
    if (text.length > 0 && !getContainsEmptyChar(text)) {
      return;
    }

    if (getHasZeroChars(text)) {
      return insertEmptyChar(editor, at);
    }

    // Workaround for race condition causing double insert on first character in empty placeholder
    if (!isFocused) {
      return;
    }

    const cleanedText = removeEmptyCharInText(text);

    // Undo (Ctrl + Z) causes the placeholder to contain two empty chars. This cleans that up.
    if (containsMultipleEmptyChars(text) && cleanedText.length === 0) {
      return ensureOnlyOneEmptyChar(editor, element, path, at);
    }

    if (cleanedText.length > 0 && getContainsEmptyChar(text)) {
      return cleanText(editor, element, path, at);
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
    () => !canManage || !hasNoVisibleText || lonePlaceholderInMaltekst(editor, element, path),
    [editor, element, hasNoVisibleText, canManage, path],
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
          style={{
            backgroundColor: isFocused ? 'var(--a-blue-100)' : 'var(--a-gray-200)',
            paddingLeft: hideDeleteButton || isReadOnly ? '0' : '1em',
          }}
          onClick={onClick}
          data-placeholder={hasNoVisibleText ? element.placeholder : undefined}
        >
          {children}
          {hideDeleteButton || isReadOnly ? null : (
            <DeleteButton title="Slett innfyllingsfelt" onClick={deletePlaceholder} contentEditable={false}>
              <TrashIcon aria-hidden />
            </DeleteButton>
          )}
        </Wrapper>
      </Tooltip>
    </PlateElement>
  );
};
