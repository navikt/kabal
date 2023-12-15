import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { GroupedFilterList, OptionGroup } from '@app/components/filter-dropdown/grouped-filter-list';
import { InputError } from '@app/components/input-error/input-error';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useLovkildeToRegistreringshjemmelForYtelse } from '@app/hooks/use-kodeverk-value';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { StyledLovhjemmelSelect } from './styled-components';

type Direction = 'down' | 'right';

interface LovhjemmelSelectProps<> {
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  error?: string;
  showFjernAlle?: boolean;
  show: boolean;
  children: string;
  openDirection?: Direction;
}

export const LovhjemmelSelect = ({
  onChange,
  selected,
  disabled,
  error,
  showFjernAlle,
  show,
  children,
  openDirection = 'right',
}: LovhjemmelSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: oppgave } = useOppgave();
  const lovKildeToRegistreringshjemler = useLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelseId ?? skipToken);

  const options: OptionGroup<string>[] = useMemo(
    () =>
      lovKildeToRegistreringshjemler.map(({ lovkilde, registreringshjemler }) => ({
        sectionHeader: {
          id: lovkilde.id,
          name: lovkilde.navn,
        },
        sectionOptions: registreringshjemler.map(({ id, navn }) => ({
          value: id,
          label: navn,
        })),
      })),
    [lovKildeToRegistreringshjemler],
  );

  useOnClickOutside(ref, () => setOpen(false), true);

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
          icon={<MagnifyingGlassIcon aria-hidden />}
        >
          {children}
        </StyledButton>

        <Popup isOpen={open} openDirection={openDirection}>
          <GroupedFilterList
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
      <InputError error={error} />
    </>
  );
};

const StyledButton = styled(Button)`
  width: 100%;
`;

interface PopupProps {
  isOpen: boolean;
  children: React.ReactNode;
  openDirection: Direction;
}

const Popup = ({ isOpen, children, openDirection }: PopupProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <StyledPopup ref={ref} $openDirection={openDirection}>
      {children}
    </StyledPopup>
  );
};

const StyledPopup = styled.div<{ $openDirection: Direction }>`
  display: flex;
  position: absolute;
  top: ${({ $openDirection }) => ($openDirection === 'down' ? '100%' : '0')};
  left: ${({ $openDirection }) => ($openDirection === 'down' ? '0' : '100%')};
  z-index: 2;
  max-height: 400px;
  max-width: 275px;
  scroll-margin-bottom: 16px;

  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;
