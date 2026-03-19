import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { getFixedCacheKey } from '@/components/behandling/behandlingsdialog/rol/helpers';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useSetRolFlowStateMutation } from '@/redux-api/oppgaver/mutations/set-rol-flowstate';
import { FlowState } from '@/types/oppgave-common';

interface Props {
  oppgaveId: string;
  isSaksbehandler: boolean;
}

export const SendToSaksbehandler = ({ oppgaveId, isSaksbehandler }: Props) => {
  const [setRolState, { isLoading }] = useSetRolFlowStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  if (isSaksbehandler || !isSuccess) {
    return null;
  }

  const { rol } = oppgave;

  if (rol.flowState !== FlowState.SENT || rol.employee?.navIdent !== user.navIdent) {
    return null;
  }

  return (
    <Button
      size="small"
      variant="primary"
      onClick={() => setRolState({ oppgaveId, flowState: FlowState.RETURNED })}
      icon={<PaperplaneIcon aria-hidden />}
      loading={isLoading}
    >
      Send tilbake til saksbehandler
    </Button>
  );
};
