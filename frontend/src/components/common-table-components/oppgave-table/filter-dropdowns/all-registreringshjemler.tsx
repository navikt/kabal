import { Registreringshjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/registreringshjemler';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useLovKildeToRegistreringshjemler } from '@/simple-api-state/use-kodeverk';

export const AllRegistreringshjemler = (props: FilterDropdownProps) => {
  const { data: lovKildeToRegistreringshjemler = [] } = useLovKildeToRegistreringshjemler();

  return <Registreringshjemler {...props} lovKildeToRegistreringshjemler={lovKildeToRegistreringshjemler} />;
};
