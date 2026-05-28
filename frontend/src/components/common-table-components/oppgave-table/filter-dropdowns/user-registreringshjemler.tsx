import { Registreringshjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/registreringshjemler';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useFilteredRegistreringshjemler } from '@/hooks/use-filtered-registreringshjemler';
import { useSettingsYtelser } from '@/hooks/use-settings-ytelser';

export const UserRegistreringshjemler = (props: FilterDropdownProps) => {
  const userYtelser = useSettingsYtelser();
  const lovKildeToRegistreringshjemler = useFilteredRegistreringshjemler(userYtelser);

  return <Registreringshjemler {...props} lovKildeToRegistreringshjemler={lovKildeToRegistreringshjemler} />;
};
