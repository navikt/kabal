import { INavEmployee } from '@app/types/bruker';

const SYSTEM_USER = 'SYSTEMBRUKER';
const SYSTEM_USER_NAME = 'Kabal';

export const formatEmployeeNameAndIdFallback = (employee: INavEmployee | null, fallback: string) => {
  if (employee === null) {
    return fallback;
  }

  return formatEmployeeNameAndId(employee);
};

export const formatEmployeeNameAndId = (employee: INavEmployee) => {
  if (employee.navIdent === SYSTEM_USER) {
    return SYSTEM_USER_NAME;
  }

  return `${employee.navn} (${employee.navIdent})`;
};

export const formatEmployeeName = (employee: INavEmployee) => {
  if (employee.navIdent === SYSTEM_USER) {
    return SYSTEM_USER_NAME;
  }

  return employee.navn;
};
