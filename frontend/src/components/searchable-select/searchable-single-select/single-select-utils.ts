import type { Entry } from '@/components/searchable-select/virtualized-option-list';

export const optionEntriesMatch = <T>(a: Entry<T> | null, b: Entry<T> | null): boolean => {
  if (a === null) {
    return b === null;
  }

  if (b === null) {
    return false;
  }

  return a.key === b.key;
};
