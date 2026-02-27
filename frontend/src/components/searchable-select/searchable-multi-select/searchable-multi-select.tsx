import { EditableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/editable-multi-select';
import { ReadOnlyMultiSelect } from '@app/components/searchable-select/searchable-multi-select/read-only-multi-select';
import type { SearchableMultiSelectProps } from '@app/components/searchable-select/searchable-multi-select/types';

export const SearchableMultiSelect = <T,>(props: SearchableMultiSelectProps<T>) => {
  const { readOnly = false } = props;

  if (readOnly) {
    return <ReadOnlyMultiSelect {...props} />;
  }

  return <EditableMultiSelect {...props} />;
};
