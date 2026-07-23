import { BodyShort } from '@navikt/ds-react';
import { Alert } from '@/components/alert/alert';
import { ConfirmArenaCheckbox } from '@/components/oppgavebehandling-footer/confirm-finish/confirm-arena-checkbox';
import { useText } from '@/components/oppgavebehandling-footer/confirm-finish/use-text';
import type { SaksTypeEnum } from '@/types/kodeverk';

interface Props {
  typeId: SaksTypeEnum;
  confirmed: boolean;
  setConfirmed: (confirmed: boolean) => void;
}

export const ConfirmFinishAlert = ({ typeId, confirmed, setConfirmed }: Props) => {
  const text = useText();

  return (
    <Alert variant="info">
      <BodyShort size="small" spacing>
        {text}
      </BodyShort>

      <ConfirmArenaCheckbox typeId={typeId} confirmed={confirmed} setConfirmed={setConfirmed} />
    </Alert>
  );
};
