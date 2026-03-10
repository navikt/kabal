import type { IOption } from '@app/components/filter-dropdown/props';
import type { INavEmployee } from '@app/types/bruker';

export const navEmployeesToOptions = (navEmployees: INavEmployee[] | undefined = []): IOption<string>[] =>
  navEmployees.map(({ navIdent, navn }) => ({ value: navIdent, label: navn }));
