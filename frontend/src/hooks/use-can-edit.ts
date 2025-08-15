import { useIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';

export const useCanEditBehandling = () => {
  const isSentToMedunderskriver = useIsSentToMedunderskriver();
  const canEdit = useIsTildeltSaksbehandler();

  if (isSentToMedunderskriver) {
    // When the case is sent to a medunderskriver, no one can edit the case.
    return false;
  }

  return canEdit;
};
