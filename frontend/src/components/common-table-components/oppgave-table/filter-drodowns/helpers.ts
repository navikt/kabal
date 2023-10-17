import { IOption } from '@app/components/filter-dropdown/props';
import { INavEmployee } from '@app/types/oppgave-common';

export const navEmployeesToOptions = (navEmployees: INavEmployee[] | undefined = []): IOption<string>[] =>
  navEmployees.map(({ navIdent, navn }) => ({ value: navIdent, label: navn }));
