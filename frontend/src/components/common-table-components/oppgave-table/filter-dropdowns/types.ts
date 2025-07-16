import type { SetParams } from '@app/components/common-table-components/oppgave-table/use-state';
import type { ColumnKeyEnum } from '@app/components/common-table-components/types';
import type { CommonOppgaverParams } from '@app/types/oppgaver';

export interface FilterDropdownProps {
  params: CommonOppgaverParams;
  setParams: SetParams;
  columnKey: ColumnKeyEnum;
}
