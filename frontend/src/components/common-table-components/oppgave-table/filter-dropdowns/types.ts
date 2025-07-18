import type { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import type { ColumnKeyEnum } from '@app/components/common-table-components/types';

export interface FilterDropdownProps {
  columnKey: ColumnKeyEnum;
  tableKey: OppgaveTableKey;
}
