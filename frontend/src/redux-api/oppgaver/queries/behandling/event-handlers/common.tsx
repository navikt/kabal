import { PartNameAndIdentifikator } from '@app/components/part-name-and-identifikator/part-name-and-identifikator';
import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import type { INavEmployee } from '@app/types/bruker';

interface Props {
  identifikator: string | null;
  name: string | null;
}

export const FormatName = (props: Props) => (
  <b>
    <PartNameAndIdentifikator {...props} />
  </b>
);

export const employeeName = (employee: INavEmployee | null, fallback = 'ingen / felles kø') => (
  <b>{formatEmployeeNameAndIdFallback(employee, fallback)}</b>
);

export const QUEUE = <b>felles kø</b>;
export const SELF = <b>seg selv</b>;
