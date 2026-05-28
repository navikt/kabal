import { Innsendingshjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/innsendingshjemler';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useAllActiveHjemler } from '@/hooks/use-all-active-hjemler';

export const AllInnsendingshjemler = (props: FilterDropdownProps) => {
  const hjemler = useAllActiveHjemler();

  return <Innsendingshjemler {...props} hjemler={hjemler} />;
};
