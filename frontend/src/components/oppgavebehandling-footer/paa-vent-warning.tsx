import { FolderFileIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, Panel } from '@navikt/ds-react';
import React, { useRef } from 'react';
import { styled } from 'styled-components';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';

interface PaaVentWarningProps {
  isOpen: boolean;
  close: () => void;
  onConfirm: () => void;
}

export const PaaVentWarning = ({ onConfirm, isOpen, close }: PaaVentWarningProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, close);

  if (!isOpen) {
    return null;
  }

  return (
    <StyledPaaVentWarning ref={ref}>
      <Alert variant="warning" inline>
        Du legger nå en oppgave som er satt på vent tilbake i felles kø. Dersom du gjør dette, vil oppgaven ikke lenger
        stå som &quot;satt på vent&quot;. Bekreft at du fortsatt ikke venter på noe.
      </Alert>
      <Buttons>
        <Button variant="secondary" size="small" onClick={close} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
        <Button variant="primary" size="small" onClick={onConfirm} icon={<FolderFileIcon aria-hidden />}>
          Jeg forstår, gå videre
        </Button>
      </Buttons>
    </StyledPaaVentWarning>
  );
};

const StyledPaaVentWarning = styled(Panel)`
  position: absolute;
  bottom: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  z-index: 1;
  border-radius: var(--a-border-radius-medium);
  min-width: 400px;
  box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.25);
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
