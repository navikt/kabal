import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useSetMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import { useSetMedunderskriverFlowStateMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState, IHelper } from '@app/types/oppgave-common';
import { getTitleLowercase } from './get-title';

interface Props {
  oppgaveId: string;
  typeId: SaksTypeEnum;
  medunderskriver: IHelper;
}

export const SendToMedunderskriver = ({ oppgaveId, typeId, medunderskriver }: Props) => {
  const canEdit = useCanEdit();
  const [, medunderskriverLoader] = useSetMedunderskriverMutation({ fixedCacheKey: oppgaveId });
  const [setMedunderskriverFlowState, loader] = useSetMedunderskriverFlowStateMutation();

  if (!canEdit) {
    return null;
  }

  const sendToMedunderskriverDisabled =
    !canEdit || medunderskriver.navIdent === null || loader.isLoading || medunderskriverLoader.isLoading;

  if (medunderskriver.flowState === FlowState.SENT) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="primary"
      type="button"
      onClick={() => setMedunderskriverFlowState({ oppgaveId, flowState: FlowState.SENT })}
      disabled={sendToMedunderskriverDisabled}
      loading={loader.isLoading || medunderskriverLoader.isLoading}
      data-testid="send-to-medunderskriver"
      icon={<PaperplaneIcon aria-hidden />}
    >
      Send til {getTitleLowercase(typeId)}
    </Button>
  );
};
