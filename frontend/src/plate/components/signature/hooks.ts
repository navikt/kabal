import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { getName, getTitle } from '@app/plate/components/signature/functions';
import { MISSING_TITLE } from '@app/plate/components/signature/title';
import type { ISignature, SignatureElement } from '@app/plate/types';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import type { ISignatureResponse } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';

export const useMedunderskriverSignature = () => {
  const { data: oppgave } = useOppgave();
  const { data: medunderskriverSignature } = useGetSignatureQuery(
    typeof oppgave?.medunderskriver.employee?.navIdent === 'string'
      ? oppgave.medunderskriver.employee.navIdent
      : skipToken,
  );

  if (oppgave === undefined || oppgave.medunderskriver.employee === null || medunderskriverSignature === undefined) {
    return null;
  }

  return medunderskriverSignature;
};

export const useMainSignature = (element: SignatureElement): ISignature | undefined => {
  const { data: oppgave } = useOppgave();
  const { templateId, creator } = useContext(SmartEditorContext);

  const isRolAnswers = templateId === TemplateIdEnum.ROL_ANSWERS;
  const isRolSakstype = oppgave?.typeId === SaksTypeEnum.KLAGE || oppgave?.typeId === SaksTypeEnum.ANKE;

  const { data: creatorSignature } = useGetSignatureQuery(isRolAnswers ? skipToken : creator);
  const { data: overrideSignature } = useGetSignatureQuery(element.overriddenSaksbehandler ?? skipToken);
  const { data: rolSignature } = useGetSignatureQuery(
    isRolAnswers && isRolSakstype ? (oppgave.rol.employee?.navIdent ?? skipToken) : skipToken,
  );

  const suffix = templateId !== TemplateIdEnum.ROL_ANSWERS && element.useSuffix ? 'saksbehandler' : undefined;

  if (isRolAnswers) {
    return toSignature(rolSignature, element.useShortName, suffix);
  }

  if (element.overriddenSaksbehandler !== undefined) {
    return toSignature(overrideSignature, element.useShortName, suffix);
  }

  return toSignature(creatorSignature, element.useShortName, suffix);
};

const toSignature = (
  signature: ISignatureResponse | undefined,
  useShortName: boolean,
  suffix: string | undefined,
): ISignature | undefined => {
  if (signature === undefined) {
    return undefined;
  }

  if (signature.anonymous) {
    return { name: 'Nav klageinstans' };
  }

  return {
    name: getName(signature, useShortName),
    title: getTitle(signature.customJobTitle, suffix) ?? MISSING_TITLE,
  };
};
