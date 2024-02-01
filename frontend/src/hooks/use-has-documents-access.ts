import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import { IMainDocument } from '@app/types/documents/documents';
import { useHasBehandlingAccess } from './oppgavebehandling/use-has-access';

export const useHasDocumentsAccess = (): boolean => {
  const isFullfoert = useIsFullfoert();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const isFeilregistrert = useIsFeilregistrert();
  const hasBehandlingAccess = useHasBehandlingAccess();

  if (isFeilregistrert) {
    return false;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole;
  }

  return hasBehandlingAccess;
};

export const useHasUploadAccess = (): boolean => {
  const isFullfoert = useIsFullfoert();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isFeilregistrert = useIsFeilregistrert();
  const hasBehandlingAccess = useHasBehandlingAccess();

  if (isFeilregistrert) {
    return false;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole || hasOppgavestyringRole;
  }

  return hasBehandlingAccess;
};

export const useHasArchiveAccess = (document: IMainDocument): boolean => {
  const isFullfoert = useIsFullfoert();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const isFeilregistrert = useIsFeilregistrert();

  const oppgaveStyringCanArchive = hasOppgavestyringRole && getIsIncomingDocument(document);

  if (isFeilregistrert) {
    return false;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole || oppgaveStyringCanArchive;
  }

  return isTildeltSaksbehandler || oppgaveStyringCanArchive;
};
