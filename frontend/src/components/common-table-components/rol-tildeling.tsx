import { Button, Skeleton } from '@navikt/ds-react';
import React from 'react';
import { OpenOppgavebehandling } from '@app/components/common-table-components/open';
import { ActionToast } from '@app/components/toast/action-toast';
import { toast } from '@app/components/toast/store';
import { useSetRolMutation } from '@app/redux-api/oppgaver/mutations/set-rol';
import { useUser } from '@app/simple-api-state/use-user';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgave } from '@app/types/oppgaver';

interface Props {
  oppgave: IOppgave;
}

export const RolTildeling = ({ oppgave }: Props) => {
  const { data: user } = useUser();
  const [setRol, { isLoading }] = useSetRolMutation();
  const { rol } = oppgave;

  const { flowState, navIdent } = rol;

  if (user === undefined) {
    return <Skeleton variant="rounded" />;
  }

  if (flowState === FlowState.NOT_SENT || flowState === FlowState.RETURNED) {
    return null;
  }

  const OpenButton = (
    <OpenOppgavebehandling
      {...oppgave}
      rolIdent={oppgave.rol.navIdent}
      medunderskriverident={oppgave.medunderskriver.navIdent}
    />
  );

  const fradel = async () => {
    try {
      await setRol({ navIdent: null, oppgaveId: oppgave.id }).unwrap();

      toast.success(
        <ActionToast
          secondary={UndoFradelAction}
          attrs={{ 'data-oppgaveid': oppgave.id, 'data-testid': 'rol-oppgave-fradelt-toast' }}
        >
          Oppgave lagt i felles kø
        </ActionToast>,
      );
    } catch (e) {
      // Error already handled in RTKQ file.
    }
  };

  const UndoTildelButton = (
    <Button size="small" variant="secondary" onClick={fradel}>
      Angre
    </Button>
  );

  const tildel = async () => {
    try {
      await setRol({ navIdent: user.navIdent, oppgaveId: oppgave.id }).unwrap();

      toast.success(
        <ActionToast
          secondary={UndoTildelButton}
          primary={OpenButton}
          attrs={{ 'data-oppgaveid': oppgave.id, 'data-testid': 'rol-oppgave-tildelt-toast' }}
        >
          Oppgave tildelt
        </ActionToast>,
      );
    } catch (e) {
      // Error already handled in RTKQ file.
    }
  };

  const UndoFradelAction = (
    <Button size="small" variant="secondary" onClick={tildel}>
      Angre
    </Button>
  );

  if (navIdent === null) {
    return (
      <Button onClick={tildel} loading={isLoading} size="small" variant="primary">
        Tildel meg
      </Button>
    );
  }

  if (navIdent === user.navIdent) {
    return (
      <Button onClick={fradel} loading={isLoading} size="small" variant="secondary">
        Legg i felles kø
      </Button>
    );
  }

  return null;
};
