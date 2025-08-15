import { StaticDataContext } from '@app/components/app/static-data-context';
import { getIsRolAnswers, getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import {
  DuaAccessCaseStatus,
  DuaAccessCreator,
  DuaAccessDocumentType,
  DuaAccessParent,
  DuaAccessUser,
  type DuaActionEnum,
  FEILREGISTRERT_ERROR,
  getDuaAccessError,
  MISSING_ROLES_ERROR,
} from '@app/hooks/dua-access/access';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { getIsRolUser } from '@app/hooks/use-is-rol';
import { useLazyParentDocument } from '@app/hooks/use-parent-document';
import { type IUserData, Role } from '@app/types/bruker';
import {
  CreatorRole,
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IParentDocument,
} from '@app/types/documents/documents';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { useContext } from 'react';

type Creator = Pick<IParentDocument['creator'], 'creatorRole'>;

interface DuaParent extends Pick<IParentDocument, 'type' | 'parentId' | 'isSmartDokument' | 'templateId'> {
  creator: Creator;
}

interface DuaAttachment extends Pick<IAttachmentDocument, 'type' | 'parentId' | 'isSmartDokument' | 'templateId'> {
  creator: Creator;
}

type Dua = DuaParent | DuaAttachment;

export const useLazyDuaAccess = () => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);
  const getParent = useLazyParentDocument();

  return (document: Dua, action: DuaActionEnum, parent?: IParentDocument) => {
    if (!isSuccess) {
      return 'Laster...';
    }

    if (oppgave.feilregistrering !== null) {
      return FEILREGISTRERT_ERROR;
    }

    const duaUser = getDuaAccessUser(user, oppgave);

    if (duaUser === null) {
      return MISSING_ROLES_ERROR;
    }

    const caseStatus = getCaseStatus(oppgave);

    return getDuaAccessError(
      duaUser,
      caseStatus,
      getDocumentType(document),
      getParentType(parent ?? getParent(document.parentId)),
      CREATOR_ROLE_TO_DUA_ACCESS_CREATOR[document.creator.creatorRole],
      action,
    );
  };
};

export const useLazyDuaAccessList = () => {
  const getDuaAccess = useLazyDuaAccess();

  return (document: Dua, actions: DuaActionEnum[], parent?: IParentDocument) =>
    actions.map((action) => getDuaAccess(document, action, parent));
};

export const useDuaAccess = (document: Dua, action: DuaActionEnum, parent?: IParentDocument) => {
  const getDuaAccess = useLazyDuaAccess();

  return getDuaAccess(document, action, parent);
};

export const useDuaAccessList = (document: Dua, actions: DuaActionEnum[], parent?: IParentDocument) => {
  const getDuaAccessList = useLazyDuaAccessList();

  return getDuaAccessList(document, actions, parent);
};

const getDuaAccessUser = (user: IUserData, oppgave: IOppgavebehandling): DuaAccessUser | null => {
  const { rol, medunderskriver, saksbehandler, isAvsluttetAvSaksbehandler } = oppgave;

  if (!isAvsluttetAvSaksbehandler) {
    if (
      (rol.flowState === FlowState.SENT || rol.flowState === FlowState.RETURNED) &&
      rol.employee?.navIdent === user.navIdent
    ) {
      return DuaAccessUser.TILDELT_ROL;
    }

    if (medunderskriver.flowState === FlowState.SENT && medunderskriver.employee?.navIdent === user.navIdent) {
      return DuaAccessUser.TILDELT_MEDUNDERSKRIVER;
    }

    if (saksbehandler?.navIdent === user.navIdent) {
      return DuaAccessUser.TILDELT_SAKSBEHANDLER;
    }
  }

  if (getIsRolUser(user.roller)) {
    return DuaAccessUser.ROL;
  }

  if (user.roller.includes(Role.KABAL_SAKSBEHANDLING)) {
    return DuaAccessUser.SAKSBEHANDLER;
  }

  return null;
};

const getCaseStatus = ({
  saksbehandler,
  medunderskriver,
  rol,
  isAvsluttetAvSaksbehandler,
}: IOppgavebehandling): DuaAccessCaseStatus => {
  if (isAvsluttetAvSaksbehandler) {
    return DuaAccessCaseStatus.FULLFOERT;
  }

  if (saksbehandler === null) {
    return DuaAccessCaseStatus.LEDIG;
  }

  const withSaksbehandler =
    (medunderskriver.employee === null || medunderskriver.flowState !== FlowState.SENT) &&
    (rol.employee === null || rol.flowState === FlowState.NOT_SENT);

  if (withSaksbehandler) {
    return DuaAccessCaseStatus.WITH_SAKSBEHANDLER;
  }

  const withMedunderskriver = medunderskriver.employee !== null && medunderskriver.flowState === FlowState.SENT;
  const withRol = rol.employee !== null && rol.flowState === FlowState.SENT;
  const returnedFromRol = rol.employee !== null && rol.flowState === FlowState.RETURNED;

  if (withMedunderskriver) {
    if (withRol) {
      return DuaAccessCaseStatus.WITH_MU_AND_ROL;
    }

    if (returnedFromRol) {
      return DuaAccessCaseStatus.WITH_MU_AND_RETURNED_FROM_ROL;
    }

    return DuaAccessCaseStatus.WITH_MU;
  }

  if (withRol) {
    return DuaAccessCaseStatus.WITH_ROL;
  }

  if (returnedFromRol) {
    return DuaAccessCaseStatus.RETURNED_FROM_ROL;
  }

  return DuaAccessCaseStatus.LEDIG;
};

const getDocumentType = (document: Dua): DuaAccessDocumentType => {
  switch (document.type) {
    case DocumentTypeEnum.JOURNALFOERT:
      return DuaAccessDocumentType.JOURNALFOERT;
    case DocumentTypeEnum.SMART: {
      if (getIsRolQuestions(document)) {
        return DuaAccessDocumentType.ROL_QUESTIONS;
      }

      if (getIsRolAnswers(document)) {
        return DuaAccessDocumentType.ROL_ANSWERS;
      }

      return DuaAccessDocumentType.SMART_DOCUMENT;
    }
    case DocumentTypeEnum.UPLOADED:
      return DuaAccessDocumentType.UPLOADED;
  }
};

const getParentType = (parent: IParentDocument | undefined): DuaAccessParent => {
  if (parent === undefined) {
    return DuaAccessParent.NONE;
  }

  switch (parent.type) {
    case DocumentTypeEnum.SMART: {
      if (getIsRolQuestions(parent)) {
        return DuaAccessParent.ROL_QUESTIONS;
      }

      return DuaAccessParent.SMART_DOCUMENT;
    }
    case DocumentTypeEnum.UPLOADED:
      return DuaAccessParent.UPLOADED;
  }
};

const CREATOR_ROLE_TO_DUA_ACCESS_CREATOR: Record<CreatorRole, DuaAccessCreator> = {
  [CreatorRole.KABAL_SAKSBEHANDLING]: DuaAccessCreator.KABAL_SAKSBEHANDLING,
  [CreatorRole.KABAL_MEDUNDERSKRIVER]: DuaAccessCreator.KABAL_MEDUNDERSKRIVER,
  [CreatorRole.KABAL_ROL]: DuaAccessCreator.KABAL_ROL,
  [CreatorRole.NONE]: DuaAccessCreator.NONE,
};
