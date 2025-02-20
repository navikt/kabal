import { Direction, PopupContainer } from '@app/components/popup-container/popup-container';
import { FolderFileIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack } from '@navikt/ds-react';

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
      <Alert className="w-75" variant="warning" inline>
        Du legger nå en oppgave som er satt på vent tilbake i felles kø. Dersom du gjør dette, vil oppgaven ikke lenger
        stå som &quot;satt på vent&quot;. Bekreft at du fortsatt ikke venter på noe.
      </Alert>
      <HStack align="center" gap="2">
        <Button variant="secondary" size="small" onClick={close} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
        <Button variant="primary" size="small" onClick={onConfirm} icon={<FolderFileIcon aria-hidden />}>
          Jeg forstår, gå videre
        </Button>
      </HStack>
    </PopupContainer>
  );
};
