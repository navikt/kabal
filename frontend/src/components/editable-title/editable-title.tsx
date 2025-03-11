import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading } from '@navikt/ds-react';
import { useRef, useState } from 'react';

interface Props {
  title: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  label: string;
}

const SIZE = 'small';
const OPACITY_50_CLASS = 'opacity-50';
const OPACITY_100_CLASS = 'opacity-100';

export const EditableTitle = ({ title, onChange, label, isLoading }: Props) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const [newTitle, setNewTitle] = useState(title);

  const onSave = () => {
    const newTrimmedTitle = newTitle.trim();

    if (newTrimmedTitle !== title) {
      onChange(newTrimmedTitle);
    }
  };

  const opacityClass = isLoading ? OPACITY_50_CLASS : OPACITY_100_CLASS;

  return (
    <HStack gap="2" align="center" className="[grid-area:title]">
      <Heading
        level="1"
        size={SIZE}
        contentEditable="plaintext-only"
        // biome-ignore lint/a11y/useSemanticElements: contenteditable
        role="textbox"
        aria-multiline="false"
        aria-label={label}
        aria-placeholder="Skriv inn tittel"
        ref={ref}
        className={`${opacityClass} min-w-32 cursor-text whitespace-pre-wrap rounded-sm border border-(--a-border-subtle) px-0.5 empty:not-focus:text-(--a-text-subtle) empty:not-focus:italic empty:not-focus:before:content-[attr(aria-placeholder)] focus:border-(--a-border-focus)`}
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
      </Heading>

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

export const getTitle = (title?: string) => (title === undefined ? '' : title.trim());
