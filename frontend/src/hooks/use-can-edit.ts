import { useIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useMemo } from 'react';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useNoOneCanEdit = () => {
  const { data, isSuccess } = useOppgave();

  return useMemo(
    () => !isSuccess || data.isAvsluttetAvSaksbehandler || data.feilregistrering !== null,
    [data, isSuccess],
  );
};

export const useCanEdit = () => {
  const isTildeltSaksbehandler = useLazyIsTildeltSaksbehandler();
  const noOneCanEdit = useNoOneCanEdit();

  if (noOneCanEdit) {
    return false;
  }

  return isTildeltSaksbehandler();
};

export const useCanEditBehandling = () => {
  const isSentToMedunderskriver = useIsSentToMedunderskriver();
  const canEdit = useCanEdit();

  if (isSentToMedunderskriver) {
    // When the case is sent to a medunderskriver, no one can edit the case.
    return false;
  }

  return canEdit;
};
