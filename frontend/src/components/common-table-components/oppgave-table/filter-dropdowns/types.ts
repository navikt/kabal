import type { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import type { ColumnKeyEnum } from '@app/components/common-table-components/types';
import type { CommonOppgaverParams } from '@app/types/oppgaver';

export interface FilterDropdownProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  columnKey: ColumnKeyEnum;
}
