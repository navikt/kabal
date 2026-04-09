import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useIsAssignedMedunderskriverAndSent } from '@/hooks/use-is-medunderskriver';
import { useSetMedunderskriverFlowStateMutation } from '@/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import { FlowState, type IMedunderskriverRol } from '@/types/oppgave-common';

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
      icon={<PaperplaneIcon aria-hidden />}
    >
      Send tilbake til saksbehandler
    </Button>
  );
};
