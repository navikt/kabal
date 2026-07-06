import { BodyLong } from '@navikt/ds-react';
import { useState } from 'react';
import { useIsFakeArenaCase } from '@/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { Buttons } from '@/components/oppgavebehandling-footer/confirm-finish/buttons';
import { ConfirmArenaCheckbox } from '@/components/oppgavebehandling-footer/confirm-finish/confirm-arena-checkbox';
import type { CancelButtonProps } from '@/components/oppgavebehandling-footer/confirm-finish/types';
import { useText } from '@/components/oppgavebehandling-footer/confirm-finish/use-text';
import { Direction, PopupContainer } from '@/components/popup-container/popup-container';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';

export const ConfirmFinish = ({ cancel }: CancelButtonProps) => {
  const text = useText();
  const { data: oppgave } = useOppgave();
  const [arenaConfirmed, setArenaConfirmed] = useState(false);
  const isFakeArenaCase = useIsFakeArenaCase();

  if (oppgave === undefined) {
    return null;
  }

  return (
    <PopupContainer close={cancel} direction={Direction.RIGHT}>
      <BodyLong>{text}</BodyLong>
      <ConfirmArenaCheckbox typeId={oppgave.typeId} confirmed={arenaConfirmed} setConfirmed={setArenaConfirmed} />
      <Buttons cancel={cancel} finishDisabled={isFakeArenaCase && !arenaConfirmed} />
    </PopupContainer>
  );
};
