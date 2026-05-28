import { Innsendingshjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/innsendingshjemler';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useAccessHjemler } from '@/hooks/use-access-hjemler';

export const AccessInnsendingshjemler = (props: FilterDropdownProps) => {
  const hjemler = useAccessHjemler();

  return <Innsendingshjemler {...props} hjemler={hjemler} />;
};
