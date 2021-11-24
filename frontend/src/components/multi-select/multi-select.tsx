import React, { useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { IKodeverkVerdi } from '../../redux-api/kodeverk';
import { ErrorMessage } from '../error-message/error-message';
import { Dropdown } from '../filter-dropdown/dropdown';
import { ToggleButton } from '../toggle-button/toggle-button';
import { StyledMultiSelect, StyledTitle } from './styled-components';

interface MultiSelectProps {
  title: React.ReactNode;
  options: IKodeverkVerdi[];
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  error?: string;
}

export const MultiSelect = ({ title, onChange, options, selected, disabled, error }: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => setOpen(false), ref, true);

  useEffect(() => {
    if (ref.current !== null && open) {
      ref.current.scrollIntoView();
    }
  }, [ref, open]);

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
      <StyledMultiSelect ref={ref}>
        <ToggleButton
          error={typeof error !== 'undefined'}
          onClick={toggleOpen}
          disabled={disabled}
          theme={{ open, minHeight: '3rem' }}
        >
          <StyledTitle>{title}</StyledTitle>
        </ToggleButton>

        <Dropdown selected={selected} options={options} open={open} onChange={setSelected} close={close} />
      </StyledMultiSelect>
      <ErrorMessage error={error} />
    </>
  );
};
