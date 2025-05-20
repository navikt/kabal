import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsAssignedRolAndSent } from '@app/hooks/use-is-rol';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import {
  CreatorRole,
  DocumentTypeEnum,
  type IDocument,
  type JournalfoertDokument,
} from '@app/types/documents/documents';
import { FlowState } from '@app/types/oppgave-common';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useCanEditDocument = (document: IDocument | null, parentDocument?: IDocument) => {
  const isRol = useIsAssignedRolAndSent();
  const isTildeltSaksbehandler = useIsTildeltSaksbehandler();
  const hasKrolRole = useHasRole(Role.KABAL_ROL);
  const isFeilregistrert = useIsFeilregistrert();
  const isFullfoert = useIsFullfoert();
  const { data: oppgave, isSuccess } = useOppgave();

  if (!isSuccess || document === null) {
    return false;
  }

  const isMarkertAvsluttet = (parentDocument ?? document).isMarkertAvsluttet === true;
  const medunderskriverFlowState = oppgave.medunderskriver.flowState;
  const rolFlowState = oppgave.rol.flowState;

  return canEditDocument({
    isRol,
    document,
    isFullfoert,
    hasKrolRole,
    isFeilregistrert,
    isTildeltSaksbehandler,
    isMarkertAvsluttet,
    medunderskriverFlowState,
    rolFlowState,
  });
};

export interface CanEditDocumentParams {
  medunderskriverFlowState: FlowState;
  isMarkertAvsluttet: boolean;
  document: IDocument;
  rolFlowState: FlowState;
  isTildeltSaksbehandler: boolean;
  hasKrolRole: boolean;
  isFeilregistrert: boolean;
  isFullfoert: boolean;
  isRol: boolean;
}

export const canEditDocument = ({
  isRol,
  document,
  isFullfoert,
  hasKrolRole,
  rolFlowState,
  isFeilregistrert,
  isTildeltSaksbehandler,
  medunderskriverFlowState,
  isMarkertAvsluttet,
}: CanEditDocumentParams) => {
  if (isMarkertAvsluttet || isFeilregistrert || document === null || document.isMarkertAvsluttet) {
    return false;
  }

  if (document.type === DocumentTypeEnum.JOURNALFOERT && !document.journalfoertDokumentReference.hasAccess) {
    // Bare brukere med tilgang til arkivvariant kan håndtere journalførte dokumenter.
    return false;
  }

  if (isFullfoert) {
    // Alle kan håndtere dokumenter i fullførte saker.
    return true;
  }

  if (document.type === DocumentTypeEnum.UPLOADED) {
    // Alle kan håndtere opplastede dokumenter.
    return true;
  }

  if (medunderskriverFlowState === FlowState.SENT) {
    // Ingen kan håndtere dokumenter i saker som er sendt til medunderskriver.
    return false;
  }

  if (document.templateId === TemplateIdEnum.ROL_ANSWERS) {
    // Bare ROL og KROL kan håndtere ROL-svar.
    return isRol || hasKrolRole;
  }

  if (isTildeltSaksbehandler) {
    // Tildelt saksbehandler kan kun håndtere dokumenter som er opprettet av brukere med rollen KABAL_SAKSBEHANDLING.
    return document.creator.creatorRole === CreatorRole.KABAL_SAKSBEHANDLING;
  }

  if (isRol) {
    if (rolFlowState !== FlowState.SENT) {
      // ROL kan kun håndtere dokumenter i saker som er sendt til ROL.
      return false;
    }

    if (document.type === DocumentTypeEnum.JOURNALFOERT && !hasAccessToArchivedDocument(document)) {
      return false;
    }

    return document.creator.creatorRole === CreatorRole.KABAL_ROL;
  }

  return false;
};

const hasAccessToArchivedDocument = (document: IDocument): document is JournalfoertDokument =>
  document.type === DocumentTypeEnum.JOURNALFOERT && document.journalfoertDokumentReference.hasAccess;
