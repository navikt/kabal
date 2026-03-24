import { Label, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { SELECT_SKELETON } from '@/components/behandling/behandlingsdialog/rol/skeleton';
import { useSetRol } from '@/components/oppgavestyring/use-set-rol';
import { toNavEmployeeEntry } from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useIsAssignedRol, useIsAssignedRolAndSent, useIsKrolUser } from '@/hooks/use-is-rol';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useTildelSaksbehandlerMutation } from '@/redux-api/oppgaver/mutations/tildeling';
import { useGetPotentialRolQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import type { INavEmployee } from '@/types/bruker';
import type { IMedunderskriverRol } from '@/types/oppgave-common';

interface Props {
  oppgaveId: string;
  rol: IMedunderskriverRol;
  isSaksbehandler: boolean;
}

const NONE_LABEL = 'Felles kø';
const NONE_ENTRY: Entry<INavEmployee | null> = {
  value: null,
  key: '__none__',
  plainText: NONE_LABEL,
  label: NONE_LABEL,
};

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

  const options = useMemo(
    (): Entry<INavEmployee | null>[] => [NONE_ENTRY, ...(potentialRol?.rols ?? []).map(toNavEmployeeEntry)],
    [potentialRol?.rols],
  );

  const { employee } = rol;

  const selectedEntry = useMemo((): Entry<INavEmployee | null> | null => {
    if (employee === null) {
      return NONE_ENTRY;
    }

    return options.find((e) => e.key === employee.navIdent) ?? NONE_ENTRY;
  }, [employee, options]);

  const canSelect = isSaksbehandler || isRol || isKrol;

  if (!canSelect) {
    return null;
  }

  if (potentialRolIsLoading || potentialRol === undefined) {
    return SELECT_SKELETON;
  }

  const fromNavIdent = rol.employee?.navIdent ?? null;

  return (
    <VStack gap="space-4">
      <Label size="small">Rådgivende overlege</Label>
      <SearchableSelect
        label="Rådgivende overlege"
        options={options}
        value={selectedEntry}
        onChange={(employee) => onChange(employee?.navIdent ?? null, fromNavIdent)}
        loading={isUpdating}
        nullLabel={NONE_LABEL}
        confirmLabel="Send til rådgivende overlege"
        requireConfirmation
      />
    </VStack>
  );
};
