import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { canRolEditDocument } from '@app/hooks/use-can-document/common';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import { CreatorRole, DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { FlowState } from '@app/types/oppgave-common';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useCanEditDocument = (document: IMainDocument | null, parentDocument?: IMainDocument) => {
  const isRol = useIsRol();
  const isTildeltSaksbehandler = useIsSaksbehandler();
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
  document: IMainDocument;
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

  // If the document is a journalfoert document, check if the user has access to the document.
  if (document.type === DocumentTypeEnum.JOURNALFOERT && !document.journalfoertDokumentReference.hasAccess) {
    return false;
  }

  // If the case is finished, anyone can edit the documents.
  // If the document is uploaded, anyone can edit it.
  if (isFullfoert || document.type === DocumentTypeEnum.UPLOADED) {
    return true;
  }

  if (medunderskriverFlowState === FlowState.SENT) {
    return false;
  }

  if (document.templateId === TemplateIdEnum.ROL_ANSWERS) {
    return isRol || hasKrolRole;
  }

  if (isTildeltSaksbehandler) {
    return document.creator.creatorRole === CreatorRole.KABAL_SAKSBEHANDLING;
  }

  if (isRol) {
    return canRolEditDocument(document, rolFlowState);
  }

  return false;
};
