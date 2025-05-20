import { useIsAssignedMedunderskriverAndSent } from '@app/hooks/use-is-medunderskriver';
import { useSetMedunderskriverFlowStateMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import { FlowState, type IMedunderskriverRol } from '@app/types/oppgave-common';
import { ArrowRedoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { getFixedCacheKey } from './helpers';

interface Props {
  oppgaveId: string;
  medunderskriver: IMedunderskriverRol;
}

export const TakeFromSaksbehandler = ({ oppgaveId, medunderskriver }: Props) => {
  const isMedunderskriver = useIsAssignedMedunderskriverAndSent();
  const [setMedunderskriverFlowState, { isLoading }] = useSetMedunderskriverFlowStateMutation({
    fixedCacheKey: getFixedCacheKey(oppgaveId),
  });

  if (!isMedunderskriver || medunderskriver.flowState !== FlowState.RETURNED) {
    return null;
  }

  return (
    <Button
      loading={isLoading}
      size="small"
      icon={<ArrowRedoIcon aria-hidden />}
      variant="primary"
      onClick={() => setMedunderskriverFlowState({ oppgaveId, flowState: FlowState.SENT })}
    >
      Hent tilbake fra saksbehandler
    </Button>
  );
};
