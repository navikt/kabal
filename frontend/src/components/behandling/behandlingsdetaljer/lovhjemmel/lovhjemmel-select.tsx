import { Search } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../../../hooks/use-on-click-outside';
import { ErrorMessage } from '../../../error-message/error-message';
import { GroupedFilterList, OptionGroup } from '../../../filter-dropdown/grouped-filter-list';
import { StyledLovhjemmelSelect } from './styled-components';

interface LovhjemmelSelectProps<T extends string> {
  options: OptionGroup<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
  disabled?: boolean;
  error?: string;
  showFjernAlle?: boolean;
  show: boolean;
}

export const LovhjemmelSelect = <T extends string>({
  onChange,
  options,
  selected,
  disabled,
  error,
  showFjernAlle,
  show,
}: LovhjemmelSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => setOpen(false), ref, true);

  if (!show) {
    return null;
  }

  const toggleOpen = () => setOpen(!open);
  const close = () => setOpen(false);

  return (
    <>
      <StyledLovhjemmelSelect ref={ref} data-testid="lovhjemmel-select" data-selected={selected.join(',')}>
        <StyledButton
          size="small"
          variant="secondary"
          onClick={toggleOpen}
          disabled={disabled}
          data-testid="lovhjemmel-button"
        >
          <Search />
          <span>Hjemmel</span>
        </StyledButton>

        <Popup isOpen={open}>
          <GroupedFilterList<T>
            selected={selected}
            options={options}
            open={open}
            onChange={onChange}
            close={close}
            showFjernAlle={showFjernAlle}
            testType="lovhjemmel"
          />
        </Popup>
      </StyledLovhjemmelSelect>
      <ErrorMessage error={error} />
    </>
  );
};

export const StyledButton = styled(Button)`
  width: 100%;
`;

interface PopupProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Popup = ({ isOpen, children }: PopupProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return <StyledPopup ref={ref}>{children}</StyledPopup>;
};

const StyledPopup = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 100%;
  max-height: 400px;
  max-width: 275px;
  scroll-margin-bottom: 16px;

  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;
