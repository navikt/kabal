import { Innsendingshjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/innsendingshjemler';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useAllActiveInnsendingshjemler } from '@/hooks/use-all-active-innsendingshjemler';

export const AllInnsendingshjemler = (props: FilterDropdownProps) => {
  const hjemler = useAllActiveInnsendingshjemler();

  return <Innsendingshjemler {...props} hjemler={hjemler} />;
};
