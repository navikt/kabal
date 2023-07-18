import React, { useCallback, useEffect, useState } from 'react';
import { Range, Transforms } from 'slate';
import { useFocused, useSelected, useSlateStatic } from 'slate-react';
import { styled } from 'styled-components';
import { FLETTEFELT_NAMES } from '../../../smart-editor/constants';
import { moveRight } from '../../functions/arrows';
import { StyledLeaf } from '../../rich-text-editor/leaf/styled';
import { RenderElementProps } from '../../slate-elements/render-props';
import { Flettefelt, FlettefeltElementType } from '../../types/editor-void-types';
import { Dropdown } from './dropdown';
import { getFlettefeltName } from './functions';
import { useFlettefeltValue } from './use-flettefelt-value';

const OPTIONS = Object.values(Flettefelt);
const MAX_FOCUSED = OPTIONS.length - 1;
const MIN_FOCUSED = 0;

export const FlettefeltElement = ({ element, children, attributes }: RenderElementProps<FlettefeltElementType>) => {
  const isSelected = useSelected();
  const isFocused = useFocused();
  const value = useFlettefeltValue(element.field);
  const editor = useSlateStatic();
  const [focused, setFocused] = useState(0);

  const isExpanded = editor.selection !== null && Range.isExpanded(editor.selection);
  const isOpen = isFocused && isSelected && editor.selection !== null && Range.isCollapsed(editor.selection);

  const close = useCallback(() => {
    setFocused(MIN_FOCUSED);
    moveRight(editor);
  }, [editor]);

  const setField = useCallback(
    (field: Flettefelt | null) => {
      close();
      Transforms.setNodes(editor, { field }, { match: (n) => n === element, at: [] });
    },
    [close, editor, element],
  );

  useEffect(() => {
    if (value === element.content) {
      return;
    }

    Transforms.setNodes(editor, { content: value }, { match: (n) => n === element, at: [] });
  }, [editor, element, value]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Tab' || event.key === ' ') {
        event.preventDefault();
        setField(OPTIONS[focused] ?? null);

        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocused((f) => (f < MAX_FOCUSED ? f + 1 : MIN_FOCUSED));

        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocused((f) => (f > MIN_FOCUSED ? f - 1 : MAX_FOCUSED));

        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    },
    [close, focused, setField],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);

      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [isOpen, onKeyDown]);

  return (
    <span {...attributes} contentEditable={false} title={getFlettefeltName(element.field)}>
      <Span $isFocused={isSelected && isFocused}>
        <StyledLeaf
          {...element}
          selected={isSelected}
          commentIds={element.threadIds}
          isExpanded={isExpanded}
          hasText
          content={element.content ?? undefined}
        >
          {renderValue(value, element.field)}
        </StyledLeaf>
        <Dropdown options={OPTIONS} field={element.field} focused={focused} isOpen={isOpen} setField={setField} />
      </Span>
      {children}
    </span>
  );
};

const renderValue = (value: string | null, field: Flettefelt | null) => {
  if (field === null) {
    return '<Velg flettefelt>';
  }

  if (value === null) {
    return `<${FLETTEFELT_NAMES[field]}>`;
  }

  return value;
};

const Span = styled.span<{ $isFocused: boolean }>`
  position: relative;
  background-color: var(--a-gray-200);
  outline: ${({ $isFocused }) => ($isFocused ? '2px solid var(--a-surface-action)' : 'none')};
  padding: 2px;
  margin-left: 1px;
  margin-right: 1px;
  border-radius: 4px;
  line-height: 1;
`;
