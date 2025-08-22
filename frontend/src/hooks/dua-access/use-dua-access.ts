import { StaticDataContext } from '@app/components/app/static-data-context';
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
import { getIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import type { IUserData } from '@app/types/bruker';
import {
  CreatorRole,
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IParentDocument,
} from '@app/types/documents/documents';
import { FlowState, type IMedunderskriverRol } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { useCallback, useContext, useMemo } from 'react';

type Creator = Pick<IParentDocument['creator'], 'creatorRole'>;

export type DuaParentDocument = Pick<IParentDocument, 'type' | 'templateId'>;

interface DuaParent extends DuaParentDocument {
  creator: Creator;
}

interface DuaAttachment extends Pick<IAttachmentDocument, 'type' | 'templateId'> {
  creator: Creator;
}

export type Dua = DuaParent | DuaAttachment;

export const useLazyDuaAccess = () => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useCallback(
    (document: Dua, action: DuaActionEnum, parent?: DuaParentDocument) => {
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
        getParentType(parent),
        CREATOR_ROLE_TO_DUA_ACCESS_CREATOR[document.creator.creatorRole],
        action,
      );
    },
    [isSuccess, oppgave, user],
  );
};

export const useLazyDuaAccessList = () => {
  const getDuaAccess = useLazyDuaAccess();

  return (document: Dua, actions: DuaActionEnum[], parent?: DuaParentDocument) =>
    actions.map((action) => getDuaAccess(document, action, parent));
};

export const useDuaAccess = (
  { creator: { creatorRole }, type, templateId }: Dua,
  action: DuaActionEnum,
  parent?: DuaParentDocument,
) => {
  const getDuaAccess = useLazyDuaAccess();

  const parentType = parent?.type;
  const parentTemplateId = parent?.templateId;

  return useMemo(
    () =>
      getDuaAccess(
        { creator: { creatorRole }, type, templateId },
        action,
        parentType === undefined || parentTemplateId === undefined
          ? undefined
          : { type: parentType, templateId: parentTemplateId },
      ),
    [creatorRole, type, templateId, action, parentType, parentTemplateId, getDuaAccess],
  );
};

export const useDuaAccessList = (document: Dua, actions: DuaActionEnum[], parent?: DuaParentDocument) => {
  const getDuaAccessList = useLazyDuaAccessList();

  return getDuaAccessList(document, actions, parent);
};

const getDuaAccessUser = (user: IUserData, oppgave: IOppgavebehandling): DuaAccessUser | null => {
  const { rol, medunderskriver, saksbehandler, isAvsluttetAvSaksbehandler } = oppgave;

  if (!isAvsluttetAvSaksbehandler) {
    if ((isWith(rol) || isReturnedFrom(rol)) && rol.employee?.navIdent === user.navIdent) {
      return DuaAccessUser.TILDELT_ROL;
    }

    if (isWith(medunderskriver) && medunderskriver.employee?.navIdent === user.navIdent) {
      return DuaAccessUser.TILDELT_MEDUNDERSKRIVER;
    }

    if (saksbehandler?.navIdent === user.navIdent) {
      return DuaAccessUser.TILDELT_SAKSBEHANDLER;
    }
  }

  if (getIsRolUser(user.roller)) {
    return DuaAccessUser.ROL;
  }

  if (getIsSaksbehandler(user.roller)) {
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

  if (isWithSaksbehandler(medunderskriver, rol)) {
    return DuaAccessCaseStatus.WITH_SAKSBEHANDLER;
  }

  if (isWith(medunderskriver)) {
    if (isWith(rol)) {
      return DuaAccessCaseStatus.WITH_MU_AND_ROL;
    }

    if (isReturnedFrom(rol)) {
      return DuaAccessCaseStatus.WITH_MU_AND_RETURNED_FROM_ROL;
    }

    return DuaAccessCaseStatus.WITH_MU;
  }

  if (isWith(rol)) {
    return DuaAccessCaseStatus.WITH_ROL;
  }

  if (isReturnedFrom(rol)) {
    return DuaAccessCaseStatus.RETURNED_FROM_ROL;
  }

  return DuaAccessCaseStatus.LEDIG;
};

const isWithSaksbehandler = (mu: IMedunderskriverRol, rol: IMedunderskriverRol) =>
  (mu.employee === null || mu.flowState !== FlowState.SENT) &&
  (rol.employee === null || rol.flowState === FlowState.NOT_SENT);

const isWith = (part: IMedunderskriverRol) => hasFlow(part, FlowState.SENT);

const isReturnedFrom = (part: IMedunderskriverRol) => hasFlow(part, FlowState.RETURNED);

const hasFlow = ({ employee, flowState }: IMedunderskriverRol, flow: FlowState) =>
  employee !== null && flowState === flow;

const getDocumentType = ({ type, templateId }: Dua): DuaAccessDocumentType => {
  switch (type) {
    case DocumentTypeEnum.JOURNALFOERT:
      return DuaAccessDocumentType.JOURNALFOERT;
    case DocumentTypeEnum.SMART: {
      if (templateId === TemplateIdEnum.ROL_QUESTIONS) {
        return DuaAccessDocumentType.ROL_QUESTIONS;
      }

      if (templateId === TemplateIdEnum.ROL_ANSWERS) {
        return DuaAccessDocumentType.ROL_ANSWERS;
      }

      return DuaAccessDocumentType.SMART_DOCUMENT;
    }
    case DocumentTypeEnum.UPLOADED:
      return DuaAccessDocumentType.UPLOADED;
  }
};

const getParentType = (parent: DuaParentDocument | undefined): DuaAccessParent => {
  if (parent === undefined) {
    return DuaAccessParent.NONE;
  }

  switch (parent.type) {
    case DocumentTypeEnum.SMART: {
      if (parent.templateId === TemplateIdEnum.ROL_QUESTIONS) {
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
