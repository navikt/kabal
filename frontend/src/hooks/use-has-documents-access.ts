import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';

export const useHasDocumentsAccess = (): boolean => {
  const isFullfoert = useIsFullfoert();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const isFeilregistrert = useIsFeilregistrert();

  if (isFeilregistrert) {
    return false;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole;
  }

  return isTildeltSaksbehandler;
};
