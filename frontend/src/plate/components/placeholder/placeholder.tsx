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
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import type { PlaceholderElement } from '@app/plate/types';
import { TrashIcon } from '@navikt/aksel-icons';
import { BoxNew, Tooltip } from '@navikt/ds-react';
import { useEditorReadOnly } from '@platejs/core/react';
import { PathApi } from 'platejs';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { type MouseEvent, useCallback, useEffect, useMemo } from 'react';

export const RedaktørPlaceholder = (props: PlateElementProps<PlaceholderElement>) => <Placeholder {...props} />;

export const SaksbehandlerPlaceholder = (props: PlateElementProps<PlaceholderElement>) => <Placeholder {...props} />;

const Placeholder = (props: PlateElementProps<PlaceholderElement>) => {
  const { children, element, editor } = props;
  const text: string = useMemo(() => element.children.map((c) => c.text).join(''), [element.children]);
  const hasNoVisibleText = useMemo(() => getHasNoVisibleText(text), [text]);
  const hasVisibleText = !hasNoVisibleText;
  const readOnly = useEditorReadOnly();
  const isDragging = window.getSelection()?.isCollapsed === false;
  const containsEmptyChar = getContainsEmptyChar(text);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const path = editor.api.findPath(element);

      if (!hasNoVisibleText) {
        return;
      }

      if (path === undefined) {
        return;
      }

      e.preventDefault();

      editor.tf.select({ path: [...path, 0], offset: containsEmptyChar ? 1 : 0 });
    },
    [containsEmptyChar, editor, element, hasNoVisibleText],
  );

  const isFocused = getIsFocused(editor, editor.api.findPath(element));

  useEffect(() => {
    const path = editor.api.findPath(element);

    if (isDragging || path === undefined) {
      return;
    }

    const at = [...path, 0];

    if (!editor.api.hasPath(at)) {
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
      const path = editor.api.findPath(element);

      if (path === undefined) {
        return;
      }

      event.stopPropagation();

      const previousPath = PathApi.previous(path);

      if (editor.selection === null && previousPath !== undefined) {
        if (!editor.api.isFocused()) {
          editor.tf.focus();
        }

        const previousPoint = editor.api.end(previousPath);

        editor.tf.setSelection({ focus: previousPoint, anchor: previousPoint });
      }

      editor.tf.delete({ at: path });

      if (!editor.api.isFocused()) {
        editor.tf.focus();
      }
    },
    [editor, element],
  );

  const hideDeleteButton = useMemo(() => {
    const path = editor.api.findPath(element);

    return (
      readOnly || hasVisibleText || lonePlaceholderInMaltekst(editor, element, path) || element.deletable === false
    );
  }, [editor, element, hasVisibleText, readOnly]);

  return (
    <PlateElement
      {...props}
      as="span"
      attributes={{
        ...props.attributes,
        contentEditable: !readOnly,
        suppressContentEditableWarning: true,
      }}
    >
      <Tooltip content={element.placeholder} maxChar={Number.POSITIVE_INFINITY} contentEditable={false}>
        <BoxNew
          position="relative"
          borderRadius="medium"
          data-node-type={ELEMENT_PLACEHOLDER}
          data-raw-placeholder={element.placeholder}
          data-placeholder={hasNoVisibleText ? element.placeholder : undefined}
          style={{
            paddingLeft: hideDeleteButton || readOnly ? '0' : '1em',
          }}
          className={`inline-block text-ax-text-neutral ${isFocused ? 'bg-ax-accent-200' : 'bg-ax-neutral-200'} after:cursor-text after:select-none after:text-ax-text-neutral-subtle after:content-[attr(data-placeholder)]`}
          onClick={onClick}
        >
          {children}
          {hideDeleteButton || readOnly ? null : (
            <BoxNew
              asChild
              title="Slett innfyllingsfelt"
              contentEditable={false}
              borderRadius="medium"
              height="1.333em"
              width="1em"
              position="absolute"
              top="0"
              left="0"
              className="inline-flex cursor-pointer items-center text-ax-text-danger-decoration hover:bg-ax-bg-neutral-moderate active:bg-ax-bg-neutral-strong"
            >
              <button type="button" onClick={deletePlaceholder}>
                <TrashIcon aria-hidden />
              </button>
            </BoxNew>
          )}
        </BoxNew>
      </Tooltip>
    </PlateElement>
  );
};
