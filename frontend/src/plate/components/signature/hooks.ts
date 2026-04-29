import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';
import { getName, getTitle } from '@/plate/components/signature/functions';
import { MISSING_TITLE } from '@/plate/components/signature/title';
import type { ISignature, SignatureElement } from '@/plate/types';
import { useGetSignatureQuery } from '@/redux-api/bruker';
import type { ISignatureResponse } from '@/types/bruker';
import { FlowState, ReviewFlowState } from '@/types/oppgave-common';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const useMedunderskriverSignature = (): {
  signature: ISignatureResponse | null;
  error: string | null;
  isLoading: boolean;
} => {
  const { templateId } = useContext(SmartEditorContext);
  const { data: oppgave } = useOppgave();
  const {
    data: medunderskriverSignature,
    isSuccess,
    isLoading,
  } = useGetSignatureQuery(
    typeof oppgave?.medunderskriver.employee?.navIdent === 'string'
      ? oppgave.medunderskriver.employee.navIdent
      : skipToken,
  );

  if (templateId === TemplateIdEnum.ROL_ANSWERS) {
    return { signature: null, error: null, isLoading: false };
  }

  if (oppgave === undefined) {
    return { signature: null, error: null, isLoading: false };
  }

  if (oppgave.medunderskriver.employee === null) {
    return { signature: null, error: null, isLoading: false };
  }

  if (
    oppgave.medunderskriver.flowState !== ReviewFlowState.APPROVED &&
    // TODO: Remove RETURNED check when there are no aktive behandlinger left with that state.
    oppgave.medunderskriver.flowState !== FlowState.RETURNED
  ) {
    return {
      signature: null,
      error: 'Medunderskrivers signatur settes ikke inn før medunderskriver har godkjent',
      isLoading: false,
    };
  }

  if (!isSuccess) {
    return { signature: null, error: null, isLoading };
  }

  return medunderskriverSignature === undefined
    ? { signature: null, error: 'Fant ikke medunderskrivers signatur', isLoading: false }
    : { signature: medunderskriverSignature, error: null, isLoading: false };
};

export const useMainSignature = (element: SignatureElement): ISignature | undefined => {
  const { data: oppgave } = useOppgave();
  const { templateId, creator } = useContext(SmartEditorContext);

  const isRolAnswers = templateId === TemplateIdEnum.ROL_ANSWERS;

  const isFinished = useIsFullfoert();
  const isOverridden = element.overriddenSaksbehandler !== undefined;

  const { data: creatorSignature } = useGetSignatureQuery(
    isFinished && !isRolAnswers && !isOverridden ? creator : skipToken,
  );
  const { data: saksbehandlerSignature } = useGetSignatureQuery(
    !isFinished && !isRolAnswers && !isOverridden ? (oppgave?.saksbehandler?.navIdent ?? skipToken) : skipToken,
  );
  const { data: overrideSignature } = useGetSignatureQuery(element.overriddenSaksbehandler ?? skipToken);
  const { data: rolSignature } = useGetSignatureQuery(
    !isOverridden && isRolAnswers ? (oppgave?.rol.employee?.navIdent ?? skipToken) : skipToken,
  );

  if (element.enabled === false) {
    return undefined;
  }

  const suffix = templateId !== TemplateIdEnum.ROL_ANSWERS && element.useSuffix ? 'saksbehandler' : undefined;

  if (element.overriddenSaksbehandler !== undefined) {
    return toSignature(overrideSignature, element.useShortName, suffix);
  }

  if (isRolAnswers) {
    return toSignature(rolSignature, element.useShortName, suffix);
  }

  return toSignature(isFinished ? creatorSignature : saksbehandlerSignature, element.useShortName, suffix);
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
    return { name: 'Arbeids- og velferdsdirektoratet Klageinstans' };
  }

  return {
    name: getName(signature, useShortName),
    title: getTitle(signature.customJobTitle, suffix) ?? MISSING_TITLE,
  };
};
