import { FolderFileIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { Direction, PopupContainer } from '@app/components/popup-container/popup-container';

interface PaaVentWarningProps {
  isOpen: boolean;
  close: () => void;
  onConfirm: () => void;
}

export const PaaVentWarning = ({ onConfirm, isOpen, close }: PaaVentWarningProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <PopupContainer close={close} direction={Direction.LEFT}>
      <StyledAlert variant="warning" inline>
        Du legger nå en oppgave som er satt på vent tilbake i felles kø. Dersom du gjør dette, vil oppgaven ikke lenger
        stå som &quot;satt på vent&quot;. Bekreft at du fortsatt ikke venter på noe.
      </StyledAlert>
      <Buttons>
        <Button variant="secondary" size="small" onClick={close} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
        <Button variant="primary" size="small" onClick={onConfirm} icon={<FolderFileIcon aria-hidden />}>
          Jeg forstår, gå videre
        </Button>
      </Buttons>
    </PopupContainer>
  );
};

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledAlert = styled(Alert)`
  width: 305px;
`;
