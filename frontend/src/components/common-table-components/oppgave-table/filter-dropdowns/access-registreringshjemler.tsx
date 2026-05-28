import { Registreringshjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/registreringshjemler';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useAvailableYtelser } from '@/hooks/use-available-ytelser';
import { useFilteredRegistreringshjemler } from '@/hooks/use-filtered-registreringshjemler';

export const AccessRegistreringshjemler = (props: FilterDropdownProps) => {
  const availableYtelser = useAvailableYtelser();
  const lovKildeToRegistreringshjemler = useFilteredRegistreringshjemler(availableYtelser);

  return <Registreringshjemler {...props} lovKildeToRegistreringshjemler={lovKildeToRegistreringshjemler} />;
};
