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
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const hasMerkantilRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const hasKrolRole = useHasRole(Role.KABAL_ROL);
  const isFeilregistrert = useIsFeilregistrert();
  const isFullfoert = useIsFullfoert();
  const { data: oppgave, isSuccess } = useOppgave();

  const parentIsMarkertAvsluttet = parentDocument?.isMarkertAvsluttet === true;

  if (!isSuccess) {
    return false;
  }

  return canEditDocument({
    isRol,
    document,
    isFullfoert,
    hasKrolRole,
    isFeilregistrert,
    hasMerkantilRole,
    hasSaksbehandlerRole,
    isTildeltSaksbehandler,
    parentIsMarkertAvsluttet,
    medunderskriverFlowState: oppgave.medunderskriver.flowState,
    rolFlowState: oppgave.rol.flowState,
  });
};

export interface CanEditDocumentParams {
  medunderskriverFlowState: FlowState;
  parentIsMarkertAvsluttet: boolean;
  document: IMainDocument | null;
  rolFlowState: FlowState;
  isTildeltSaksbehandler: boolean;
  hasSaksbehandlerRole: boolean;
  hasMerkantilRole: boolean;
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
  hasMerkantilRole,
  hasSaksbehandlerRole,
  isTildeltSaksbehandler,
  medunderskriverFlowState,
  parentIsMarkertAvsluttet,
}: CanEditDocumentParams) => {
  if (parentIsMarkertAvsluttet || isFeilregistrert || document === null || document.isMarkertAvsluttet) {
    return false;
  }

  const isJournalfoert = document.type === DocumentTypeEnum.JOURNALFOERT;

  if (isJournalfoert && !document.journalfoertDokumentReference.harTilgangTilArkivvariant) {
    return false;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole;
  }

  if (medunderskriverFlowState === FlowState.SENT) {
    return false;
  }

  if (document.templateId === TemplateIdEnum.ROL_ANSWERS) {
    return isRol || hasKrolRole;
  }

  if (hasMerkantilRole) {
    return true;
  }

  if (isTildeltSaksbehandler) {
    return document.creator.creatorRole === CreatorRole.KABAL_SAKSBEHANDLING;
  }

  if (isRol) {
    return canRolEditDocument(document, rolFlowState);
  }

  return false;
};
