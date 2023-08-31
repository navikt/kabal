import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useIsMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetMedunderskriverFlowStateMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import { FlowState, IHelper } from '@app/types/oppgave-common';

interface Props {
  oppgaveId: string;
  medunderskriver: IHelper;
}

export const SendToSaksbehandler = ({ oppgaveId, medunderskriver }: Props) => {
  const isMedunderskriver = useIsMedunderskriver();
  const isSaksbehandler = useIsSaksbehandler();
  const [setFlowState, loader] = useSetMedunderskriverFlowStateMutation();

  if (isSaksbehandler || !isMedunderskriver || medunderskriver.flowState !== FlowState.SENT) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="small"
      onClick={() => setFlowState({ oppgaveId, flowState: FlowState.RETURNED })}
      disabled={loader.isLoading}
      loading={loader.isLoading}
      data-testid="send-to-saksbehandler"
      icon={<PaperplaneIcon aria-hidden />}
    >
      Send tilbake til saksbehandler
    </Button>
  );
};
