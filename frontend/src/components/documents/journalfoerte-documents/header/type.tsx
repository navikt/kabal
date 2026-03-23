import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import type { useFilters } from '@/components/documents/journalfoerte-documents/header/use-filters';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { isNotUndefined } from '@/functions/is-not-type-guards';
import { Journalposttype } from '@/types/arkiverte-documents';

interface Props extends Pick<ReturnType<typeof useFilters>, 'selectedTypes' | 'setSelectedTypes'> {}

export const Type = ({ selectedTypes, setSelectedTypes }: Props) => (
  <SearchableMultiSelect
    label="type"
    options={JOURNALPOSTTYPE_OPTIONS}
    value={selectedTypes.map((t) => JOURNALPOSTTYPE_OPTIONS.find((o) => o.value === t)).filter(isNotUndefined)}
    valueKey={getTypeKey}
    formatOption={getTypeLabel}
    emptyLabel="Type"
    filterText={getTypeLabel}
    onChange={(types) => setSelectedTypes(types.map((t) => t.value))}
    style={{ gridArea: Fields.Type }}
    triggerSize="small"
    triggerVariant="tertiary"
    triggerDisplay="count"
    showSelectAll
  />
);

const JOURNALPOSTTYPE_OPTIONS = [
  { label: 'Inngående', value: Journalposttype.INNGAAENDE },
  { label: 'Utgående', value: Journalposttype.UTGAAENDE },
  { label: 'Notat', value: Journalposttype.NOTAT },
];

const getTypeKey = ({ value }: { value: Journalposttype }) => value;

const getTypeLabel = ({ label }: { label: string }) => label;
