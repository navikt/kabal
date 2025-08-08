import { StaticDataContext } from '@app/components/app/static-data-context';
import { OpenOppgavebehandling } from '@app/components/common-table-components/open';
import { ActionToast } from '@app/components/toast/action-toast';
import { toast } from '@app/components/toast/store';
import { useSetRolMutation } from '@app/redux-api/oppgaver/mutations/set-rol';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgave } from '@app/types/oppgaver';
import { Button } from '@navikt/ds-react';
import { useContext } from 'react';

interface Props {
  oppgave: IOppgave;
}

export const RolTildeling = ({ oppgave }: Props) => {
  const { user } = useContext(StaticDataContext);
  const [setRol, { isLoading }] = useSetRolMutation();
  const { rol } = oppgave;

  const { flowState, employee } = rol;

  if (flowState === FlowState.NOT_SENT || flowState === FlowState.RETURNED) {
    return null;
  }

  const OpenButton = (
    <OpenOppgavebehandling {...oppgave} medunderskriverident={oppgave.medunderskriver.employee?.navIdent ?? null} />
  );

  const fradel = async () => {
    try {
      await setRol({ employee: null, oppgaveId: oppgave.id }).unwrap();

      toast.success(
        <ActionToast
          secondary={UndoFradelAction}
          attrs={{ 'data-oppgaveid': oppgave.id, 'data-testid': 'rol-oppgave-fradelt-toast' }}
        >
          Oppgave lagt i felles kø
        </ActionToast>,
      );
    } catch {
      // Error already handled in RTKQ file.
    }
  };

  const UndoTildelButton = (
    <Button size="small" variant="secondary-neutral" onClick={fradel}>
      Angre
    </Button>
  );

  const tildel = async () => {
    try {
      await setRol({ employee: { navIdent: user.navIdent, navn: user.navn }, oppgaveId: oppgave.id }).unwrap();

      toast.success(
        <ActionToast
          secondary={UndoTildelButton}
          primary={OpenButton}
          attrs={{ 'data-oppgaveid': oppgave.id, 'data-testid': 'rol-oppgave-tildelt-toast' }}
        >
          Oppgave tildelt
        </ActionToast>,
      );
    } catch {
      // Error already handled in RTKQ file.
    }
  };

  const UndoFradelAction = (
    <Button size="small" variant="secondary-neutral" onClick={tildel}>
      Angre
    </Button>
  );

  if (employee === null) {
    return (
      <Button onClick={tildel} loading={isLoading} size="small" variant="primary">
        Tildel meg
      </Button>
    );
  }

  if (employee.navIdent === user.navIdent) {
    return (
      <Button onClick={fradel} loading={isLoading} size="small" variant="secondary-neutral">
        Legg i felles kø
      </Button>
    );
  }

  return null;
};
