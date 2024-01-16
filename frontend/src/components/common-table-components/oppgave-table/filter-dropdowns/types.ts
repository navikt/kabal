import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { CommonOppgaverParams } from '@app/types/oppgaver';

export interface FilterDropdownProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  columnKey: ColumnKeyEnum;
}
