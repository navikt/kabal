import { Innsendingshjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/innsendingshjemler';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useAccessInnsendingshjemler } from '@/hooks/use-access-innsendingshjemler';

export const AccessInnsendingshjemler = (props: FilterDropdownProps) => {
  const hjemler = useAccessInnsendingshjemler();

  return <Innsendingshjemler {...props} hjemler={hjemler} />;
};
