import { Innsendingshjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/innsendingshjemler';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useSettingsInnsendingshjemler } from '@/hooks/use-settings-innsendingshjemler';

export const UserInnsendingshjemler = (props: FilterDropdownProps) => {
  const hjemler = useSettingsInnsendingshjemler();

  return <Innsendingshjemler {...props} hjemler={hjemler} />;
};
