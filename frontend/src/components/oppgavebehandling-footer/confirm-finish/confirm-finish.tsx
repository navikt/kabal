import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';
import { useIsFakeArenaCase } from '@/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { Buttons } from '@/components/oppgavebehandling-footer/confirm-finish/buttons';
import { ConfirmEkspedisjonsbrevCheckbox } from '@/components/oppgavebehandling-footer/confirm-finish/confirm-ekspedisjonsbrev-checkbox';
import { ConfirmFinishAlert } from '@/components/oppgavebehandling-footer/confirm-finish/confirm-finish-alert';
import { isAnkeToTrygderettenUtfall } from '@/components/oppgavebehandling-footer/confirm-finish/helpers';
import type { CancelButtonProps } from '@/components/oppgavebehandling-footer/confirm-finish/types';
import { Direction, PopupContainer } from '@/components/popup-container/popup-container';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useGetEkspedisjonsbrevTilTrygderettenIsSentQuery } from '@/redux-api/oppgaver/queries/documents';

export const ConfirmFinish = ({ cancel }: CancelButtonProps) => {
  const { data: oppgave } = useOppgave();
  const [arenaConfirmed, setArenaConfirmed] = useState(false);
  const [ekspedisjonsbrevConfirmed, setEkspedisjonsbrevConfirmed] = useState(false);
  const isFakeArenaCase = useIsFakeArenaCase();

  const isAnkeToTrygderetten =
    oppgave !== undefined && isAnkeToTrygderettenUtfall(oppgave.typeId, oppgave.resultat.utfallId);

  const { data: isEkspedisjonsbrevSent } = useGetEkspedisjonsbrevTilTrygderettenIsSentQuery(
    !isAnkeToTrygderetten ? skipToken : oppgave.id,
  );

  if (oppgave === undefined) {
    return null;
  }

  const requiresEkspedisjonsbrevConfirmation = isAnkeToTrygderetten && isEkspedisjonsbrevSent === false;

  return (
    <PopupContainer close={cancel} direction={Direction.RIGHT}>
      <ConfirmFinishAlert typeId={oppgave.typeId} confirmed={arenaConfirmed} setConfirmed={setArenaConfirmed} />

      {requiresEkspedisjonsbrevConfirmation ? (
        <ConfirmEkspedisjonsbrevCheckbox
          confirmed={ekspedisjonsbrevConfirmed}
          setConfirmed={setEkspedisjonsbrevConfirmed}
        />
      ) : null}

      <Buttons
        cancel={cancel}
        finishDisabled={
          (isFakeArenaCase && !arenaConfirmed) || (requiresEkspedisjonsbrevConfirmation && !ekspedisjonsbrevConfirmed)
        }
      />
    </PopupContainer>
  );
};
