import { Innsendingshjemler } from '@/components/common-table-components/oppgave-table/filter-dropdowns/innsendingshjemler';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useSettingsHjemler } from '@/hooks/use-settings-hjemler';

export const UserInnsendingshjemler = (props: FilterDropdownProps) => {
  const hjemler = useSettingsHjemler();

  return <Innsendingshjemler {...props} hjemler={hjemler} />;
};
