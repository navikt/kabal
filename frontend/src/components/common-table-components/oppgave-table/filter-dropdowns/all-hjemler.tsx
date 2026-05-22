import { Hjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/hjemler';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useAllActiveHjemler } from '@/hooks/use-all-active-hjemler';

export const AllHjemler = (props: FilterDropdownProps) => {
  const hjemler = useAllActiveHjemler();

  return <Hjemler {...props} hjemler={hjemler} />;
};
