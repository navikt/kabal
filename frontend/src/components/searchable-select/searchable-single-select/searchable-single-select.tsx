import { EditableSelect } from '@/components/searchable-select/searchable-single-select/editable-select';
import { ReadOnlySelect } from '@/components/searchable-select/searchable-single-select/read-only-select';
import type { SearchableSelectProps } from '@/components/searchable-select/searchable-single-select/types';

export const SearchableSelect = <T,>(props: SearchableSelectProps<T>) => {
  const { readOnly = false } = props;

  if (readOnly) {
    return <ReadOnlySelect {...props} />;
  }

  return <EditableSelect {...props} />;
};
