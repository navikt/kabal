import { stringToRegExp } from '@app/functions/string-to-regex';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Search } from '@navikt/ds-react';
import { type KeyboardEventHandler, useRef } from 'react';
import { styled } from 'styled-components';

interface HeaderProps {
  focused: number;
  optionsCount: number;
  showFjernAlle?: boolean;
  close: () => void;
  onReset: () => void;
  onFocusChange: (focused: number) => void;
  onSelect: () => void;
  onFilterChange: (query: RegExp) => void;
}

export const Header = ({
  optionsCount,
  onSelect,
  focused,
  onFocusChange,
  onFilterChange,
  close,
  onReset,
  showFjernAlle = true,
}: HeaderProps): JSX.Element | null => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onInputChange = (value: string) => onFilterChange(stringToRegExp(value));

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      onFocusChange(-1);

      return close();
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (focused === optionsCount - 1) {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        return onFocusChange(-1);
      }

      return onFocusChange(focused + 1);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (focused === -1) {
        return onFocusChange(optionsCount - 1);
      }

      if (focused === 0) {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      return onFocusChange(focused - 1);
    }

    if ((event.key === 'Enter' || (event.key === ' ' && focused !== -1)) && focused < optionsCount && focused !== -1) {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <StyledHeader>
      <Search
        onChange={onInputChange}
        defaultValue=""
        placeholder="Søk"
        label="Søk"
        hideLabel
        onKeyDown={onKeyDown}
        autoFocus
        size="small"
        variant="simple"
        ref={inputRef}
        data-testid="header-filter"
      />
      {showFjernAlle && (
        <StyledButton size="xsmall" variant="danger" onClick={onReset} icon={<TrashIcon aria-hidden />}>
          Fjern alle
        </StyledButton>
      )}
    </StyledHeader>
  );
};

const StyledButton = styled(Button)`
  margin-left: 0.5em;
  flex-shrink: 0;
`;

const StyledHeader = styled.div`
  position: sticky;
  top: 0;
  border-bottom: 1px solid var(--a-border-divider);
  background-color: var(--a-bg-default);
  padding: var(--a-spacing-2);
  display: flex;
  justify-content: space-between;
  z-index: 1;
`;
