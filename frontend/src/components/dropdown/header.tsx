import { Knapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import React, { KeyboardEventHandler, useRef } from 'react';
import styled from 'styled-components';
import { StyledHeader } from './styled-components';

export interface Option {
  label: string;
  value: string;
}

export interface SectionHeader {
  id: string;
  name?: string;
}

export interface OptionGroup {
  sectionHeader: SectionHeader;
  sectionOptions: Option[];
}

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

  const onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const cleanFilter = removeRegExpTokens(target.value);
    const pattern = cleanFilter.split('').join('.*');
    const escapedPattern = escapeRegExp(pattern);

    const filter = new RegExp(`.*${escapedPattern}.*`, 'i');
    onFilterChange(filter);
  };

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

    if (event.key === 'Enter' || (event.key === ' ' && focused !== -1)) {
      if (focused < optionsCount && focused !== -1) {
        event.preventDefault();
        onSelect();
      }
    }
  };

  return (
    <StyledHeader>
      <StyledInput
        onChange={onInputChange}
        defaultValue=""
        placeholder="Søk"
        onKeyDown={onKeyDown}
        autoFocus
        type="search"
        bredde="fullbredde"
        inputRef={(e) => {
          inputRef.current = e;
        }}
        data-testid="dropdown-search"
      />
      {showFjernAlle && (
        <StyledKnapp mini kompakt onClick={onReset}>
          Fjern alle
        </StyledKnapp>
      )}
    </StyledHeader>
  );
};

const removeRegExpTokens = (pattern: string): string => pattern.replace(/[/\\^$*+?.()|[\]{}\s]/g, '');
const escapeRegExp = (pattern: string): string => pattern.replaceAll('-', '\\-');

const StyledKnapp = styled(Knapp)`
  &&& {
    margin-left: 0.5em;
  }
`;

const StyledInput = styled(Input)`
  flex-grow: 1;
`;
