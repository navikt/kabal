import Knapp from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import React, { KeyboardEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { IKodeverkVerdi } from '../../redux-api/kodeverk';
import { Filter } from './option';

interface DropdownProps {
  selected: string[];
  options: IKodeverkVerdi[];
  onChange: (id: string | null, active: boolean) => void;
  open: boolean;
  close: () => void;
}

export const Dropdown = ({ selected, options, open, onChange, close }: DropdownProps): JSX.Element | null => {
  const [rawFilter, setFilter] = useState('');
  const [focused, setFocused] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const topItemRef = useRef<HTMLLIElement>(null);

  const filter = useMemo<RegExp>(
    () => new RegExp(`.*${rawFilter.replaceAll(' ', '').split('').join('.*')}.*`, 'i'),
    [rawFilter]
  );

  useEffect(() => {
    setFilteredOptions(options.filter(({ beskrivelse }) => filter.test(beskrivelse)));
  }, [setFilteredOptions, options, filter]);

  useEffect(() => {
    if (!open && focused !== -1) {
      setFocused(-1);
    }
  }, [open, focused]);

  if (!open) {
    return null;
  }

  const reset = () => {
    onChange(null, false);
  };

  const onFilterChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(target.value);
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      setFocused(-1);
      return close();
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (focused === filteredOptions.length - 1) {
        topItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        return setFocused(-1);
      }

      return setFocused(focused + 1);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (focused === -1) {
        return setFocused(filteredOptions.length - 1);
      }

      if (focused === 0) {
        topItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
      }

      return setFocused(focused - 1);
    }

    if (event.key === 'Enter' || (event.key === ' ' && focused !== -1)) {
      if (focused < filteredOptions.length && focused !== -1) {
        event.preventDefault();
        const { id } = filteredOptions[focused];
        return onChange(id, !selected.includes(id));
      }
    }
  };

  return (
    <StyledList>
      <StyledTopListItem ref={topItemRef}>
        <StyledInput onChange={onFilterChange} value={rawFilter} placeholder="Søk" onKeyDown={onKeyDown} autoFocus />
        <Knapp mini kompakt onClick={reset}>
          Fjern alle
        </Knapp>
      </StyledTopListItem>
      {filteredOptions.map(({ id, beskrivelse }, i) => (
        <StyledListItem key={id}>
          <Filter active={selected.includes(id)} filterId={id} onChange={onChange} focused={i === focused}>
            {beskrivelse}
          </Filter>
        </StyledListItem>
      ))}
    </StyledList>
  );
};

const StyledList = styled.ul`
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0;
  margin: 0;
  min-width: 100%;
  list-style: none;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  max-height: calc(100vh - 20em);
  overflow-y: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  z-index: 1;
  width: 100%;
  min-width: 275px;
  max-height: 256px;
`;

const StyledListItem = styled.li`
  margin: 0;
  padding: 0;
  width: 100%;
`;

const StyledTopListItem = styled(StyledListItem)`
  border-bottom: 1px solid #c6c2bf;
  background-color: white;
  padding: 8px;
  display: flex;
  justify-content: space-between;
`;

const StyledInput = styled(Input)`
  &&& {
    margin-right: 0.5em;
  }

  width: 100%;
`;
