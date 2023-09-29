import {
  canRolEditDocument,
  getIsDocumentOwner,
  getIsInnsynsbegaering,
} from '@app/components/documents/new-documents/hooks/helpers';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

export const useCanEditDocument = (document: IMainDocument) => {
  const isRol = useIsRol();
  const isSaksbehandler = useIsSaksbehandler();
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const { data: oppgave } = useOppgave();
  const { data: user } = useUser();

  if (oppgave === undefined || document.isMarkertAvsluttet || isFeilregistrert) {
    return false;
  }

  if (getIsInnsynsbegaering(document)) {
    return getIsDocumentOwner(document, user?.navIdent);
  }

  if (isFinished) {
    return false;
  }

  const isJournalfoert = document.type === DocumentTypeEnum.JOURNALFOERT;

  if (isJournalfoert && !document.journalfoertDokumentReference.harTilgangTilArkivvariant) {
    return false;
  }

  if (isSaksbehandler) {
    return document.creatorRole === Role.KABAL_SAKSBEHANDLING;
  }

  return isRol && canRolEditDocument(document, oppgave);
};
