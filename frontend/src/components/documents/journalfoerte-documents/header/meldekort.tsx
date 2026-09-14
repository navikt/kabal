import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import type { useFilters } from '@/components/documents/journalfoerte-documents/header/use-filters';
import {
  MELDEKORT_FILTER_LABELS,
  MELDEKORT_FILTER_OPTIONS,
  type MeldekortFilter,
} from '@/components/documents/journalfoerte-documents/meldekort';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';

interface Props extends Pick<ReturnType<typeof useFilters>, 'meldekortFilter' | 'setMeldekortFilter'> {}

const OPTIONS: Entry<MeldekortFilter>[] = MELDEKORT_FILTER_OPTIONS.map((value) => ({
  value,
  key: value,
  label: MELDEKORT_FILTER_LABELS[value],
  plainText: MELDEKORT_FILTER_LABELS[value],
}));

export const Meldekort = ({ meldekortFilter, setMeldekortFilter }: Props) => (
  <SearchableSelect
    label="Meldekort"
    options={OPTIONS}
    value={OPTIONS.find((o) => o.key === meldekortFilter) ?? null}
    onChange={setMeldekortFilter}
    nullLabel="Meldekort"
    showSearch={false}
    style={{ gridArea: Fields.Meldekort }}
    triggerSize="small"
    triggerVariant="tertiary"
  />
);
