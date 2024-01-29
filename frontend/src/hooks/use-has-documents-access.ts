import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';

export const useHasDocumentsAccess = (): boolean => {
  const isFullfoert = useIsFullfoert();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const isFeilregistrert = useIsFeilregistrert();

  if (isFeilregistrert) {
    return false;
  }

  if (hasOppgavestyringRole) {
    return true;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole;
  }

  return isTildeltSaksbehandler;
};

export const useHasUploadAccess = (): boolean => {
  const isFullfoert = useIsFullfoert();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const isFeilregistrert = useIsFeilregistrert();

  if (isFeilregistrert) {
    return false;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole || hasOppgavestyringRole;
  }

  return isTildeltSaksbehandler || hasOppgavestyringRole;
};

export const useHasArchiveAccess = (document: IMainDocument): boolean => {
  const isFullfoert = useIsFullfoert();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const isFeilregistrert = useIsFeilregistrert();

  const oppgaveStyringCanArchive =
    hasOppgavestyringRole && document.dokumentTypeId === DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN;

  if (isFeilregistrert) {
    return false;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole || oppgaveStyringCanArchive;
  }

  return isTildeltSaksbehandler || oppgaveStyringCanArchive;
};
