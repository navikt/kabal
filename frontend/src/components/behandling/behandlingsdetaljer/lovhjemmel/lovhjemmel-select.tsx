import { Søkeknapp } from 'nav-frontend-ikonknapper';
import React, { useRef, useState } from 'react';
import { useOnClickOutside } from '../../../../hooks/use-on-click-outside';
import { GroupedDropdown, OptionGroup } from '../../../dropdown/grouped-dropdown';
import { ErrorMessage } from '../../../error-message/error-message';
import { StyledHjemler, StyledLovhjemmelSelect } from './styled-components';

interface LovhjemmelSelectProps {
  options: OptionGroup[];
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  error?: string;
  showFjernAlle?: boolean;
  show: boolean;
}

export const LovhjemmelSelect = ({
  onChange,
  options,
  selected,
  disabled,
  error,
  showFjernAlle,
  show,
}: LovhjemmelSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => setOpen(false), ref, true);

  if (!show) {
    return null;
  }

  const setSelected = (id: string | null, active: boolean) => {
    if (id === null) {
      onChange([]);
      return;
    }

    const newList = active ? [...selected, id] : selected.filter((selectedValue: string) => selectedValue !== id);

    onChange(newList);
  };

  const toggleOpen = () => setOpen(!open);
  const close = () => setOpen(false);

  return (
    <>
      <StyledLovhjemmelSelect ref={ref} data-testid="lovhjemmel" data-selected={selected.join(',')}>
        <StyledHjemler>
          <Søkeknapp mini onClick={toggleOpen} disabled={disabled} data-testid="lovhjemmel-button">
            <span>Hjemmel</span>
          </Søkeknapp>
        </StyledHjemler>

        <GroupedDropdown
          selected={selected}
          options={options}
          open={open}
          onChange={setSelected}
          close={close}
          showFjernAlle={showFjernAlle}
          top={0}
          left="370px"
          maxHeight="400px"
          testId="lovhjemmel-dropdown"
        />
      </StyledLovhjemmelSelect>
      <ErrorMessage error={error} />
    </>
  );
};
