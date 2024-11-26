import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  title: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  label: string;
}

const SIZE = 'small';

export const EditableTitle = ({ title, onChange, label, isLoading }: Props) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const [newTitle, setNewTitle] = useState(title);

  const onSave = () => {
    if (newTitle !== title) {
      onChange(newTitle);
    }
  };

  return (
    <HStack gap="2" align="center" gridColumn="title">
      <StyledTitle
        level="1"
        size={SIZE}
        contentEditable="plaintext-only"
        // biome-ignore lint/a11y/useSemanticElements: contenteditable
        role="textbox"
        aria-multiline="false"
        aria-label={label}
        aria-placeholder="Skriv inn tittel"
        ref={ref}
        style={{ opacity: isLoading ? 0.5 : 1 }}
        onFocus={(e) => {
          setCaretAtEnd(e.currentTarget);
        }}
        onBlur={(e) => {
          e.preventDefault();
          onSave();
          // Reset selection.
          window.getSelection()?.removeAllRanges();

          // Reset content if empty. Otherwise, the placeholder will not show because the browser adds a <br> tag.
          const { textContent } = e.currentTarget;

          if (textContent === null || textContent?.length === 0) {
            e.currentTarget.innerText = title;
          }
        }}
        onKeyDown={(e) => {
          const { key } = e;
          if (key === 'Enter') {
            e.preventDefault();
            onSave();
          } else if (key === 'Escape') {
            e.preventDefault();
            e.currentTarget.textContent = title;
            setCaretAtEnd(e.currentTarget);
            setNewTitle(title);
          }
        }}
        onInput={(e) => {
          const { currentTarget } = e;

          setNewTitle(currentTarget.textContent ?? '');
        }}
        suppressContentEditableWarning
      >
        {getTitle(title)}
      </StyledTitle>

      <Button
        variant="tertiary"
        size="small"
        onClick={() => {
          ref.current?.focus();
        }}
        icon={<PencilIcon aria-hidden />}
        loading={isLoading}
        disabled={false}
      />
    </HStack>
  );
};

const setCaretAtEnd = (element: HTMLElement) => {
  const selection = window.getSelection();

  if (selection === null) {
    return;
  }

  selection.selectAllChildren(element);
  selection.collapseToEnd();
};

const StyledTitle = styled(Heading)`
  cursor: text;
  min-width: var(--a-spacing-32);
  border-radius: var(--a-border-radius-medium);
  border-width: var(--a-spacing-05);
  border-style: solid;
  border-color: var(--a-border-subtle);
  padding-left: var(--a-spacing-05);
  padding-right: var(--a-spacing-05);
  
  &:focus {
    border-color: var(--a-border-focus);
  }

  &:empty:not(:focus)::before {
    color: var(--a-text-subtle);
    font-style: italic;
    content: attr(aria-placeholder);
  }
`;

export const getTitle = (title?: string) => (title === undefined ? '' : title.trim());
