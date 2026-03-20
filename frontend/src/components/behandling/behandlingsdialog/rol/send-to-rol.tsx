import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { getFixedCacheKey } from '@/components/behandling/behandlingsdialog/rol/helpers';
import { useSetRolMutation } from '@/redux-api/oppgaver/mutations/set-rol';
import { useSetRolFlowStateMutation } from '@/redux-api/oppgaver/mutations/set-rol-flowstate';
import { FlowState, type IMedunderskriverRol } from '@/types/oppgave-common';

interface Props {
  oppgaveId: string;
  isSaksbehandler: boolean;
  rol: IMedunderskriverRol;
}

export const SendToRol = ({ oppgaveId, isSaksbehandler, rol }: Props) => {
  const [setRolState, { isLoading }] = useSetRolFlowStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });
  const [, { isLoading: isSettingRol }] = useSetRolMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });

  if (!isSaksbehandler || rol.flowState === FlowState.SENT) {
    return null;
  }

  return (
    <Button
      data-color="neutral"
      size="small"
      variant="secondary"
      onClick={() => setRolState({ oppgaveId, flowState: FlowState.SENT })}
      icon={<PaperplaneIcon aria-hidden />}
      loading={isLoading || isSettingRol}
    >
      Send til {rol.employee === null ? 'felles kø' : 'rådgivende overlege'}
    </Button>
  );
};
