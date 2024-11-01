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
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import type { PlaceholderElement } from '@app/plate/types';
import { TrashIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import { getEndPoint, getPreviousPath, setSelection } from '@udecode/plate-common';
import {
  PlateElement,
  type PlateElementProps,
  findNodePath,
  focusEditor,
  isEditorFocused,
  useEditorReadOnly,
} from '@udecode/plate-common/react';
import { type MouseEvent, useCallback, useContext, useEffect, useMemo } from 'react';

export const RedaktørPlaceholder = (props: PlateElementProps<PlaceholderElement>) => (
  <Placeholder {...props} canManage />
);

export const PreviewPlaceholder = (props: PlateElementProps<PlaceholderElement>) => (
  <Placeholder {...props} canManage={false} />
);

export const SaksbehandlerPlaceholder = (props: PlateElementProps<PlaceholderElement>) => {
  const { canManage } = useContext(SmartEditorContext);

  return <Placeholder {...props} canManage={canManage} />;
};

interface PlaceholderProps extends PlateElementProps<PlaceholderElement> {
  canManage: boolean;
}

const Placeholder = ({ canManage, ...props }: PlaceholderProps) => {
  const { children, element, editor } = props;
  const text: string = useMemo(() => element.children.map((c) => c.text).join(''), [element.children]);
  const hasNoVisibleText = useMemo(() => getHasNoVisibleText(text), [text]);
  const isReadOnly = useEditorReadOnly();
  const isDragging = window.getSelection()?.isCollapsed === false;
  const containsEmptyChar = getContainsEmptyChar(text);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const path = findNodePath(editor, element);

      if (!hasNoVisibleText) {
        return;
      }

      if (path === undefined) {
        return;
      }

      e.preventDefault();

      editor.select({ path: [...path, 0], offset: containsEmptyChar ? 1 : 0 });
    },
    [containsEmptyChar, editor, element, hasNoVisibleText],
  );

  const isFocused = getIsFocused(editor, findNodePath(editor, element));

  useEffect(() => {
    const path = findNodePath(editor, element);

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
  }, [editor, element, isDragging, isFocused, text]);

  const deletePlaceholder = useCallback(
    (event: MouseEvent) => {
      const path = findNodePath(editor, element);

      if (path === undefined) {
        return;
      }

      event.stopPropagation();

      const previousPath = getPreviousPath(path);

      if (editor.selection === null && previousPath !== undefined) {
        if (!isEditorFocused(editor)) {
          focusEditor(editor);
        }

        const previousPoint = getEndPoint(editor, previousPath);

        setSelection(editor, { focus: previousPoint, anchor: previousPoint });
      }

      editor.delete({ at: path });

      if (!isEditorFocused(editor)) {
        focusEditor(editor);
      }
    },
    [editor, element],
  );

  const hideDeleteButton = useMemo(() => {
    const path = findNodePath(editor, element);

    return !(canManage && hasNoVisibleText) || lonePlaceholderInMaltekst(editor, element, path);
  }, [editor, element, hasNoVisibleText, canManage]);

  return (
    <PlateElement<PlaceholderElement> {...props} asChild contentEditable suppressContentEditableWarning>
      <Tooltip content={element.placeholder} maxChar={Number.POSITIVE_INFINITY} contentEditable={false}>
        <Wrapper
          data-node-type={ELEMENT_PLACEHOLDER}
          data-raw-placeholder={element.placeholder}
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
