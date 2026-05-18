import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { Ytelser } from '@/components/common-table-components/oppgave-table/filter-dropdowns/ytelser';
import { useSettingsYtelser } from '@/hooks/use-settings-ytelser';

export const UserYtelser = (props: FilterDropdownProps) => {
  const ytelseOptions = useSettingsYtelser();

  return <Ytelser {...props} ytelser={ytelseOptions} />;
};
