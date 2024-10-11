import { useSetRolMutation } from '@app/redux-api/oppgaver/mutations/set-rol';
import { useSetRolStateMutation } from '@app/redux-api/oppgaver/mutations/set-rol-flowstate';
import { FlowState, type IMedunderskriverRol } from '@app/types/oppgave-common';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { getFixedCacheKey } from './helpers';

interface Props {
  oppgaveId: string;
  isSaksbehandler: boolean;
  rol: IMedunderskriverRol;
}

export const SendToRol = ({ oppgaveId, isSaksbehandler, rol }: Props) => {
  const [setRolState, { isLoading }] = useSetRolStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });
  const [, { isLoading: isSettingRol }] = useSetRolMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });

  if (!isSaksbehandler || rol.flowState === FlowState.SENT) {
    return null;
  }

  return (
    <Button
      size="small"
      onClick={() => setRolState({ oppgaveId, flowState: FlowState.SENT })}
      icon={<PaperplaneIcon aria-hidden />}
      loading={isLoading || isSettingRol}
    >
      Send til {rol.employee === null ? 'felles kø' : 'rådgivende overlege'}
    </Button>
  );
};
