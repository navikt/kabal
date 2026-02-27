import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/rol/helpers';
import { SELECT_SKELETON } from '@app/components/behandling/behandlingsdialog/rol/skeleton';
import { SearchableNavEmployeeSelectWithLabel } from '@app/components/searchable-select/searchable-nav-employee-select-with-label';
import { useIsAssignedRol, useIsAssignedRolAndSent, useIsKrolUser } from '@app/hooks/use-is-rol';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetRolMutation } from '@app/redux-api/oppgaver/mutations/set-rol';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { useGetPotentialRolQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { FlowState, type IMedunderskriverRol } from '@app/types/oppgave-common';
import { skipToken } from '@reduxjs/toolkit/query';

interface Props {
  oppgaveId: string;
  rol: IMedunderskriverRol;
  isSaksbehandler: boolean;
}

export const SelectRol = ({ oppgaveId, rol, isSaksbehandler }: Props) => {
  const [, { isLoading }] = useTildelSaksbehandlerMutation({ fixedCacheKey: oppgaveId });
  const isTildeltSaksbehandler = useIsTildeltSaksbehandler();
  const isTildeltRol = useIsAssignedRol();
  const isKrol = useIsKrolUser();
  const { data: potentialRol, isLoading: potentialRolIsLoading } = useGetPotentialRolQuery(
    (isTildeltSaksbehandler || isTildeltRol || isKrol) && !isLoading ? oppgaveId : skipToken,
  );
  const [setRol, { isLoading: setRolIsLoading }] = useSetRolMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });
  const isRol = useIsAssignedRolAndSent();

  const canSelect = isSaksbehandler || isRol || isKrol;

  if (!canSelect) {
    return null;
  }

  if (potentialRolIsLoading || potentialRol === undefined) {
    return SELECT_SKELETON;
  }

  const noneLabel = rol.flowState === FlowState.SENT ? 'Felles kø' : 'Ingen / felles kø';

  return (
    <SearchableNavEmployeeSelectWithLabel
      label="Rådgivende overlege"
      onChange={(employee) => setRol({ oppgaveId, employee })}
      onClear={() => setRol({ oppgaveId, employee: null })}
      value={rol.employee}
      disabled={setRolIsLoading}
      options={potentialRol.rols}
      nullLabel={noneLabel}
      confirmLabel="Sett rådgivende overlege"
    />
  );
};
