import type { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import type { ColumnKeyEnum } from '@app/components/common-table-components/types';

export interface FilterDropdownProps {
  columnKey: ColumnKeyEnum;
  tableKey: OppgaveTableKey;
}

export enum CommonHelperStatus {
  SENDT_TIL_MU = 'SENDT_TIL_MU',
  RETURNERT_FRA_MU = 'RETURNERT_FRA_MU',
  SENDT_TIL_FELLES_ROL_KOE = 'SENDT_TIL_FELLES_ROL_KOE',
  SENDT_TIL_ROL = 'SENDT_TIL_ROL',
  RETURNERT_FRA_ROL = 'RETURNERT_FRA_ROL',
}

export enum HelperStatusSelf {
  MU = 'MU',
}

export type HelperStatus = CommonHelperStatus | HelperStatusSelf;
