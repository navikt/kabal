import { FolderFileIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, InlineMessage } from '@navikt/ds-react';
import { Direction, PopupContainer } from '@/components/popup-container/popup-container';

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
      <InlineMessage className="w-75" status="warning">
        Du legger nå en oppgave som er satt på vent tilbake i felles kø. Dersom du gjør dette, vil oppgaven ikke lenger
        stå som &quot;satt på vent&quot;. Bekreft at du fortsatt ikke venter på noe.
      </InlineMessage>
      <HStack align="center" gap="space-8">
        <Button data-color="neutral" variant="secondary" size="small" onClick={close} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
        <Button variant="primary" size="small" onClick={onConfirm} icon={<FolderFileIcon aria-hidden />}>
          Jeg forstår, gå videre
        </Button>
      </HStack>
    </PopupContainer>
  );
};
