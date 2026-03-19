import { ArrowRedoIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps } from '@navikt/ds-react';
import { getFixedCacheKey } from '@/components/behandling/behandlingsdialog/rol/helpers';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useIsAssignedRol } from '@/hooks/use-is-rol';
import { useSetRolFlowStateMutation } from '@/redux-api/oppgaver/mutations/set-rol-flowstate';
import { FlowState } from '@/types/oppgave-common';

interface Props {
  oppgaveId: string;
  variant?: ButtonProps['variant'];
}

export const TakeFromSaksbehandler = ({ oppgaveId, variant = 'primary' }: Props) => {
  const isAssignedRol = useIsAssignedRol();
  const [setRolState, { isLoading }] = useSetRolFlowStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });
  const { data: oppgave, isSuccess } = useOppgave();

  if (!isSuccess || !isAssignedRol) {
    return null;
  }

  const { rol } = oppgave;

  if (rol === null || rol.flowState !== FlowState.RETURNED) {
    return null;
  }

  return (
    <Button
      loading={isLoading}
      size="small"
      icon={<ArrowRedoIcon aria-hidden />}
      variant={variant}
      onClick={() => setRolState({ oppgaveId, flowState: FlowState.SENT })}
    >
      Hent tilbake fra saksbehandler
    </Button>
  );
};
