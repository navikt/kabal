import { StaticDataContext } from '@app/components/app/static-data-context';
import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/rol/helpers';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSetRolStateMutation } from '@app/redux-api/oppgaver/mutations/set-rol-flowstate';
import { FlowState } from '@app/types/oppgave-common';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useContext } from 'react';

interface Props {
  oppgaveId: string;
  isSaksbehandler: boolean;
}

export const SendToSaksbehandler = ({ oppgaveId, isSaksbehandler }: Props) => {
  const [setRolState, { isLoading }] = useSetRolStateMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });
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
