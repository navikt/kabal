import { Button } from '@navikt/ds-react';
import { ActionToast } from '@/components/toast/action-toast';
import { toast } from '@/components/toast/store';
import { useHasRole } from '@/hooks/use-has-role';
import { useSetRolMutation } from '@/redux-api/oppgaver/mutations/set-rol';
import { Role } from '@/types/bruker';
import { FlowState } from '@/types/oppgave-common';
import type { IOppgave } from '@/types/oppgaver';

export const FradelRolButton = ({ id, rol }: Pick<IOppgave, 'id' | 'rol'>) => {
  const hasKrolAccess = useHasRole(Role.KABAL_KROL);
  const [setRol, { isLoading }] = useSetRolMutation();

  if (!hasKrolAccess || rol.flowState !== FlowState.SENT || rol.employee === null) {
    return null;
  }

  const rolEmployee = rol.employee;

  const tildel = async () => {
    try {
      await setRol({ employee: rolEmployee, oppgaveId: id }).unwrap();
      toast.success(
        <ActionToast secondary={UndoTildelAction} attrs={{ 'data-oppgaveid': id }}>
          Oppgave tildelt på nytt
        </ActionToast>,
      );
    } catch {
      // Error already handled in RTKQ file.
    }
  };

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

  const UndoTildelAction = (
    <Button data-color="neutral" size="small" variant="secondary" onClick={fradel}>
      Angre
    </Button>
  );

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
      onClick={fradel}
      className="whitespace-nowrap [grid-area:tildel]"
    >
      Legg i felles kø
    </Button>
  );
};
