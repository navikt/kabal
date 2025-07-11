import { useIsAssignedMedunderskriverAndSent } from '@app/hooks/use-is-medunderskriver';
import { useSetMedunderskriverFlowStateMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import { FlowState, type IMedunderskriverRol } from '@app/types/oppgave-common';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface Props {
  oppgaveId: string;
  medunderskriver: IMedunderskriverRol;
}

export const SendToSaksbehandler = ({ oppgaveId, medunderskriver }: Props) => {
  const isMedunderskriver = useIsAssignedMedunderskriverAndSent();
  const [setFlowState, { isLoading }] = useSetMedunderskriverFlowStateMutation();

  if (!isMedunderskriver || medunderskriver.flowState !== FlowState.SENT) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="small"
      onClick={() => setFlowState({ oppgaveId, flowState: FlowState.RETURNED })}
      disabled={isLoading}
      loading={isLoading}
      data-testid="send-to-saksbehandler"
      icon={<PaperplaneIcon aria-hidden />}
    >
      Send tilbake til saksbehandler
    </Button>
  );
};
