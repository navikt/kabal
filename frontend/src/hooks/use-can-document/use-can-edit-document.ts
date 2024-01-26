import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { canRolEditDocument } from '@app/hooks/use-can-document/common';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import { CreatorRole, DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

export const useCanEditDocument = (document: IMainDocument, parentDocument?: IMainDocument) => {
  const isMerkantil = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isRol = useIsRol();
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const isFeilregistrert = useIsFeilregistrert();
  const isFullfoert = useIsFullfoert();
  const { data: oppgave } = useOppgave();

  const parentIsMarkertAvsluttet = parentDocument?.isMarkertAvsluttet === true;

  if (parentIsMarkertAvsluttet || document.isMarkertAvsluttet || isFeilregistrert || oppgave === undefined) {
    return false;
  }

  const isJournalfoert = document.type === DocumentTypeEnum.JOURNALFOERT;

  if (isJournalfoert && !document.journalfoertDokumentReference.harTilgangTilArkivvariant) {
    return false;
  }

  if (isMerkantil) {
    return true;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole;
  }

  if (isTildeltSaksbehandler) {
    return document.creator.creatorRole === CreatorRole.KABAL_SAKSBEHANDLING;
  }

  return isRol && canRolEditDocument(document, oppgave);
};
