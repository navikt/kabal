import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { getFixedCacheKey } from '@/components/behandling/behandlingsdialog/rol/helpers';
import { useSetRolFlowStateMutation } from '@/redux-api/oppgaver/mutations/set-rol-flowstate';
import { FlowState, type IMedunderskriverRol } from '@/types/oppgave-common';

interface Props {
  oppgaveId: string;
  isSaksbehandler: boolean;
  rol: IMedunderskriverRol;
}

export const TakeFromRol = ({ oppgaveId, isSaksbehandler, rol }: Props) => {
  const [setRolState, { isLoading }] = useSetRolFlowStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });

  if (!isSaksbehandler || rol.flowState !== FlowState.SENT) {
    return null;
  }

  const from = rol.employee === null ? 'felles kø' : 'rådgivende overlege';

  return (
    <Button
      loading={isLoading}
      size="small"
      icon={<ArrowUndoIcon aria-hidden />}
      variant="secondary"
      data-color="neutral"
      onClick={() => setRolState({ oppgaveId, flowState: FlowState.NOT_SENT })}
    >
      Hent tilbake fra {from}
    </Button>
  );
};
