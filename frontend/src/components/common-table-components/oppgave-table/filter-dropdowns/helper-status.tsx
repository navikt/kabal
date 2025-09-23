import { ShortParamKey } from '@app/components/common-table-components/oppgave-table/state/short-names';
import {
  fromTyperParam,
  useOppgaveTableHelperStatusWithoutSelf,
  useOppgaveTableHelperStatusWithSelf,
  useOppgaveTableTyper,
} from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Table } from '@navikt/ds-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { FilterDropdownProps, HelperStatus } from './types';
import { CommonHelperStatus, HelperStatusSelf } from './types';

export const HelperStatusWithoutSelf = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [statuses, setStatuses] = useOppgaveTableHelperStatusWithoutSelf(tableKey);

  const [query] = useSearchParams();
  const typer = fromTyperParam(query.get(`${tableKey}.${ShortParamKey.TYPER}`)) ?? [];

  const options = useMemo(() => {
    if (typer.length === 0) {
      return COMMON_COMBO_MU_OPTIONS;
    }

    if (typer.every((type) => type !== SaksTypeEnum.ANKE_I_TRYGDERETTEN)) {
      return COMMON_NON_ANKE_I_TR_MU_OPTIONS;
    }

    if (typer.every((type) => type === SaksTypeEnum.ANKE_I_TRYGDERETTEN)) {
      return COMMON_ANKE_I_TR_MU_OPTIONS;
    }

    return COMMON_COMBO_MU_OPTIONS;
  }, [typer]);

  return (
    <Table.ColumnHeader aria-sort="none">
      <FilterDropdown<HelperStatus>
        selected={statuses ?? []}
        onChange={setStatuses}
        options={[...options, ...COMMON_ROL_OPTIONS]}
        data-testid="filter-type"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};

export const HelperStatusWithSelf = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [typer = []] = useOppgaveTableTyper(tableKey);
  const [statuses, setStatuses] = useOppgaveTableHelperStatusWithSelf(tableKey);

  const options = useMemo(() => {
    if (typer.length === 0) {
      return [COMBO_MU_OPTION, ...COMMON_COMBO_MU_OPTIONS];
    }

    if (typer.every((type) => type !== SaksTypeEnum.ANKE_I_TRYGDERETTEN)) {
      return [NON_ANKE_I_TR_MU_OPTION, ...COMMON_NON_ANKE_I_TR_MU_OPTIONS];
    }

    if (typer.every((type) => type === SaksTypeEnum.ANKE_I_TRYGDERETTEN)) {
      return [ANKE_I_TR_MU_OPTION, ...COMMON_ANKE_I_TR_MU_OPTIONS];
    }

    return [COMBO_MU_OPTION, ...COMMON_COMBO_MU_OPTIONS];
  }, [typer]);

  return (
    <Table.ColumnHeader aria-sort="none">
      <FilterDropdown<HelperStatus>
        selected={statuses ?? []}
        onChange={setStatuses}
        options={[...options, ...COMMON_ROL_OPTIONS]}
        data-testid="filter-type"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};

const COMMON_ROL_OPTIONS = [
  { value: CommonHelperStatus.SENDT_TIL_FELLES_ROL_KOE, label: 'I felles kø for ROL' },
  { value: CommonHelperStatus.SENDT_TIL_ROL, label: 'Sendt til ROL' },
  { value: CommonHelperStatus.RETURNERT_FRA_ROL, label: 'Tilbake fra ROL' },
];

const COMMON_NON_ANKE_I_TR_MU_OPTIONS = [
  { value: CommonHelperStatus.SENDT_TIL_MU, label: 'Sendt til MU' },
  { value: CommonHelperStatus.RETURNERT_FRA_MU, label: 'Tilbake fra MU' },
];

const COMMON_ANKE_I_TR_MU_OPTIONS = [
  { value: CommonHelperStatus.SENDT_TIL_MU, label: 'Sendt til fagansvarlig' },
  { value: CommonHelperStatus.RETURNERT_FRA_MU, label: 'Tilbake fra fagansvarlig' },
];

const COMMON_COMBO_MU_OPTIONS = [
  { value: CommonHelperStatus.SENDT_TIL_MU, label: 'Sendt til MU/fagansvarlig' },
  { value: CommonHelperStatus.RETURNERT_FRA_MU, label: 'Tilbake fra MU/fagansvarlig' },
];

const NON_ANKE_I_TR_MU_OPTION = { value: HelperStatusSelf.MU, label: 'MU' };
const ANKE_I_TR_MU_OPTION = { value: HelperStatusSelf.MU, label: 'Fagansvarlig' };
const COMBO_MU_OPTION = { value: HelperStatusSelf.MU, label: 'MU/fagansvarlig' };
