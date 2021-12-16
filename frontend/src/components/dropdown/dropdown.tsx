import React, { useEffect, useState } from 'react';
import { IKodeverkVerdi } from '../../redux-api/kodeverk';
import { Header } from './header';
import { Filter } from './option';
import { StyledDropdown, StyledListItem, StyledSectionList } from './styled-components';

interface DropdownProps {
  selected: string[];
  options: IKodeverkVerdi[];
  onChange: (id: string | null, active: boolean) => void;
  open: boolean;
  close: () => void;
}

export const Dropdown = ({ selected, options, open, onChange, close }: DropdownProps): JSX.Element | null => {
  const [filter, setFilter] = useState<RegExp>(/.*/g);
  const [focused, setFocused] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState(options);

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

  const onSelectFocused = () => {
    const focusedOption = options[focused].id;
    onChange(focusedOption, !selected.includes(focusedOption));
  };

  return (
    <StyledDropdown>
      <Header
        onFocusChange={setFocused}
        onFilterChange={setFilter}
        onSelect={onSelectFocused}
        focused={focused}
        onReset={reset}
        optionsCount={options.length}
        close={close}
        showFjernAlle={true}
      />
      <StyledSectionList>
        {filteredOptions.map(({ id, beskrivelse }, i) => (
          <StyledListItem key={id}>
            <Filter active={selected.includes(id)} filterId={id} onChange={onChange} focused={i === focused}>
              {beskrivelse}
            </Filter>
          </StyledListItem>
        ))}
      </StyledSectionList>
    </StyledDropdown>
  );
};
