import { useState } from 'react';
import { useIsFakeArenaCase } from '@/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { Buttons } from '@/components/oppgavebehandling-footer/confirm-finish/buttons';
import { ConfirmEkspedisjonsbrevCheckbox } from '@/components/oppgavebehandling-footer/confirm-finish/confirm-ekspedisjonsbrev-checkbox';
import {
  ArenaConfirmationCheckbox,
  ConfirmFinishInfo,
} from '@/components/oppgavebehandling-footer/confirm-finish/confirm-finish-info';
import type { CancelButtonProps } from '@/components/oppgavebehandling-footer/confirm-finish/types';
import { Direction, PopupContainer } from '@/components/popup-container/popup-container';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';

interface Props extends CancelButtonProps {
  /**
   * `undefined` means not relevant, no confirmation needed.
   * `true` means it has been sent, no confirmation needed.
   * `false` means it has not been sent, confirmation needed.
   */
  isEkspedisjonsbrevSent: boolean | undefined;
}

export const ConfirmFinish = ({ cancel, isEkspedisjonsbrevSent }: Props) => {
  const { data: oppgave } = useOppgave();
  const [arenaConfirmed, setArenaConfirmed] = useState(false);
  const [ekspedisjonsbrevConfirmed, setEkspedisjonsbrevConfirmed] = useState(false);
  const requiresArenaConfirmation = useIsFakeArenaCase();

  if (oppgave === undefined) {
    return null;
  }

  const { typeId } = oppgave;
  const requiresEkspedisjonsbrevConfirmation = isEkspedisjonsbrevSent === false;

  return (
    <PopupContainer close={cancel} direction={Direction.RIGHT}>
      <ConfirmFinishInfo>
        {requiresArenaConfirmation ? (
          <ArenaConfirmationCheckbox typeId={typeId} confirmed={arenaConfirmed} setConfirmed={setArenaConfirmed} />
        ) : null}
      </ConfirmFinishInfo>

      {requiresEkspedisjonsbrevConfirmation ? (
        <ConfirmEkspedisjonsbrevCheckbox
          confirmed={ekspedisjonsbrevConfirmed}
          setConfirmed={setEkspedisjonsbrevConfirmed}
        />
      ) : null}

      <Buttons
        cancel={cancel}
        finishDisabled={
          (requiresArenaConfirmation && !arenaConfirmed) ||
          (requiresEkspedisjonsbrevConfirmation && !ekspedisjonsbrevConfirmed)
        }
      />
    </PopupContainer>
  );
};
