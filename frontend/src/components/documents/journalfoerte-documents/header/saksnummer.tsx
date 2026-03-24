import { useMemo } from 'react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import type { useFilters } from '@/components/documents/journalfoerte-documents/header/use-filters';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import type { IArkiverteDocumentsResponse } from '@/types/arkiverte-documents';

interface SaksnummerProps extends Pick<ReturnType<typeof useFilters>, 'selectedSaksIds' | 'setSelectedSaksIds'> {
  sakList: IArkiverteDocumentsResponse['sakList'];
}

export const Saksnummer = ({ sakList, selectedSaksIds, setSelectedSaksIds }: SaksnummerProps) => {
  const options = useMemo<Entry<string>[]>(() => {
    if (sakList.length === 0) {
      return [];
    }

    const set = new Set<string>();

    for (const { fagsakId } of sakList) {
      if (fagsakId !== null) {
        set.add(fagsakId);
      }
    }

    return set
      .values()
      .toArray()
      .map((s) => ({ value: s, key: s, label: s, plainText: s }));
  }, [sakList]);

  const value = useMemo<Entry<string>[]>(
    () => options.filter((o) => selectedSaksIds.includes(o.key)),
    [options, selectedSaksIds],
  );

  return (
    <SearchableMultiSelect
      label="Saksnummer"
      options={options}
      value={value}
      emptyLabel="Saksnummer"
      onChange={setSelectedSaksIds}
      style={{ gridArea: Fields.Saksnummer }}
      triggerSize="small"
      triggerVariant="tertiary"
      triggerDisplay="count"
      showSelectAll
    />
  );
};
