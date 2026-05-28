import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { Ytelser } from '@/components/common-table-components/oppgave-table/filter-dropdowns/ytelser';
import { useAvailableYtelser } from '@/hooks/use-available-ytelser';

export const AccessYtelser = (props: FilterDropdownProps) => {
  const availableYtelser = useAvailableYtelser();

  return <Ytelser {...props} ytelser={availableYtelser} />;
};
