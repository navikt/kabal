import { Button } from '@navikt/ds-react';
import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { OpenForRoleAccess } from '@/components/common-table-components/open';
import { ActionToast } from '@/components/toast/action-toast';
import { toast } from '@/components/toast/store';
import { useHasRole } from '@/hooks/use-has-role';
import { useSetRolMutation } from '@/redux-api/oppgaver/mutations/set-rol';
import { Role } from '@/types/bruker';
import { FlowState } from '@/types/oppgave-common';
import type { IOppgave } from '@/types/oppgaver';

export const TildelRolButton = ({ id, rol, medunderskriver, tildeltSaksbehandlerident }: IOppgave) => {
  const { user } = useContext(StaticDataContext);
  const { navIdent, navn } = user;
  const isRol = useHasRole(Role.KABAL_ROL);
  const [setRol, { isLoading }] = useSetRolMutation();

  if (!isRol || rol.flowState !== FlowState.SENT || rol.employee !== null) {
    return null;
  }

  const fradel = async () => {
    try {
      await setRol({ employee: null, oppgaveId: id }).unwrap();
      toast.success(
        <ActionToast secondary={UndoFradelAction} attrs={{ 'data-oppgaveid': id }}>
          Oppgave lagt i felles kø
        </ActionToast>,
      );
    } catch {
      // Error already handled in RTKQ file.
    }
  };

  const UndoTildelButton = (
    <Button data-color="neutral" size="small" variant="secondary" onClick={fradel}>
      Angre
    </Button>
  );

  const OpenButton = (
    <OpenForRoleAccess
      id={id}
      tildeltSaksbehandlerident={tildeltSaksbehandlerident}
      medunderskriverident={medunderskriver.employee?.navIdent ?? null}
      rol={rol}
    />
  );

  const tildel = async () => {
    try {
      await setRol({ employee: { navIdent, navn }, oppgaveId: id }).unwrap();
      toast.success(
        <ActionToast secondary={UndoTildelButton} primary={OpenButton} attrs={{ 'data-oppgaveid': id }}>
          Oppgave tildelt
        </ActionToast>,
      );
    } catch {
      // Error already handled in RTKQ file.
    }
  };

  const UndoFradelAction = (
    <Button data-color="neutral" size="small" variant="secondary" onClick={tildel}>
      Angre
    </Button>
  );

  return (
    <Button
      data-color="neutral"
      variant="secondary"
      size="small"
      loading={isLoading}
      disabled={isLoading}
      data-klagebehandlingid={id}
      onClick={tildel}
      className="whitespace-nowrap [grid-area:tildel]"
    >
      Tildel meg
    </Button>
  );
};
