import { useMemo } from 'react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import type { useFilters } from '@/components/documents/journalfoerte-documents/header/use-filters';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { Journalposttype } from '@/types/arkiverte-documents';

interface Props extends Pick<ReturnType<typeof useFilters>, 'selectedTypes' | 'setSelectedTypes'> {}

interface JournalposttypeOption {
  label: string;
  value: Journalposttype;
}

const JOURNALPOSTTYPE_OPTIONS: Entry<JournalposttypeOption>[] = [
  {
    value: { label: 'Inngående', value: Journalposttype.INNGAAENDE },
    key: Journalposttype.INNGAAENDE,
    label: 'Inngående',
    plainText: 'Inngående',
  },
  {
    value: { label: 'Utgående', value: Journalposttype.UTGAAENDE },
    key: Journalposttype.UTGAAENDE,
    label: 'Utgående',
    plainText: 'Utgående',
  },
  {
    value: { label: 'Notat', value: Journalposttype.NOTAT },
    key: Journalposttype.NOTAT,
    label: 'Notat',
    plainText: 'Notat',
  },
];

export const Type = ({ selectedTypes, setSelectedTypes }: Props) => {
  const selectedEntries = useMemo(
    () => JOURNALPOSTTYPE_OPTIONS.filter((o) => selectedTypes.includes(o.value.value)),
    [selectedTypes],
  );

  return (
    <SearchableMultiSelect
      label="type"
      options={JOURNALPOSTTYPE_OPTIONS}
      value={selectedEntries}
      emptyLabel="Type"
      onChange={(types) => setSelectedTypes(types.map((t) => t.value))}
      style={{ gridArea: Fields.Type }}
      triggerSize="small"
      triggerVariant="tertiary"
      triggerDisplay="count"
      showSelectAll
    />
  );
};
