import { useSetRolStateMutation } from '@app/redux-api/oppgaver/mutations/set-rol-flowstate';
import { FlowState, type IMedunderskriverRol } from '@app/types/oppgave-common';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { getFixedCacheKey } from './helpers';

interface Props {
  oppgaveId: string;
  isSaksbehandler: boolean;
  rol: IMedunderskriverRol;
}

export const TakeFromRol = ({ oppgaveId, isSaksbehandler, rol }: Props) => {
  const [setRolState, { isLoading }] = useSetRolStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });

  if (!isSaksbehandler || rol.flowState !== FlowState.SENT) {
    return null;
  }

  const from = rol.employee === null ? 'felles kø' : 'rådgivende overlege';

  return (
    <Button
      loading={isLoading}
      size="small"
      icon={<ArrowUndoIcon aria-hidden />}
      variant="primary"
      onClick={() => setRolState({ oppgaveId, flowState: FlowState.NOT_SENT })}
    >
      Hent tilbake fra {from}
    </Button>
  );
};
