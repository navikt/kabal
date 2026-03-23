import { skipToken } from '@reduxjs/toolkit/query';
import { SELECT_SKELETON } from '@/components/behandling/behandlingsdialog/rol/skeleton';
import { useSetRol } from '@/components/oppgavestyring/use-set-rol';
import { SearchableNavEmployeeSelectWithLabel } from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select-with-label';
import { useIsAssignedRol, useIsAssignedRolAndSent, useIsKrolUser } from '@/hooks/use-is-rol';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useTildelSaksbehandlerMutation } from '@/redux-api/oppgaver/mutations/tildeling';
import { useGetPotentialRolQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import type { IMedunderskriverRol } from '@/types/oppgave-common';

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
  const { onChange, isUpdating } = useSetRol(oppgaveId, potentialRol?.rols);
  const isRol = useIsAssignedRolAndSent();

  const canSelect = isSaksbehandler || isRol || isKrol;

  if (!canSelect) {
    return null;
  }

  if (potentialRolIsLoading || potentialRol === undefined) {
    return SELECT_SKELETON;
  }

  const fromNavIdent = rol.employee?.navIdent ?? null;

  return (
    <SearchableNavEmployeeSelectWithLabel
      label="Rådgivende overlege"
      onChange={(employee) => onChange(employee.navIdent, fromNavIdent)}
      onClear={() => onChange(null, fromNavIdent)}
      value={rol.employee}
      loading={isUpdating}
      options={potentialRol.rols}
      nullLabel="Felles kø"
      confirmLabel="Send til rådgivende overlege"
    />
  );
};
