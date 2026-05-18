import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { Ytelser } from '@/components/common-table-components/oppgave-table/filter-dropdowns/ytelser';
import { useSimpleYtelser } from '@/simple-api-state/use-kodeverk';

export const AllYtelser = (props: FilterDropdownProps) => {
  const { data: ytelseOptions = [] } = useSimpleYtelser();

  return <Ytelser {...props} ytelser={ytelseOptions} />;
};
