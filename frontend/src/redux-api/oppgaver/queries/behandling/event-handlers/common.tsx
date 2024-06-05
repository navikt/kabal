import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import { formatIdNumber } from '@app/functions/format-id';
import { INavEmployee } from '@app/types/bruker';

interface Props {
  id: string;
  name: string | null;
}

export const FormatName = ({ id, name = 'Navn mangler' }: Props) => (
  <b>
    {name} ({formatIdNumber(id)})
  </b>
);

export const employeeName = (employee: INavEmployee | null, fallback: string = 'ingen / felles kø') => (
  <b>{formatEmployeeNameAndIdFallback(employee, fallback)}</b>
);

export const QUEUE = <b>felles kø</b>;
export const SELF = <b>seg selv</b>;
