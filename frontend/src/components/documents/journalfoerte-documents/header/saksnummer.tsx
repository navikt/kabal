import { useMemo } from 'react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import type { useFilters } from '@/components/documents/journalfoerte-documents/header/use-filters';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { IArkiverteDocumentsResponse } from '@/types/arkiverte-documents';

interface SaksnummerProps extends Pick<ReturnType<typeof useFilters>, 'selectedSaksIds' | 'setSelectedSaksIds'> {
  sakList: IArkiverteDocumentsResponse['sakList'];
}

export const Saksnummer = ({ sakList, selectedSaksIds, setSelectedSaksIds }: SaksnummerProps) => {
  const options = useMemo<string[]>(() => {
    if (sakList.length === 0) {
      return [];
    }

    const set = new Set<string>();

    for (const { fagsakId } of sakList) {
      if (fagsakId !== null) {
        set.add(fagsakId);
      }
    }

    return set.values().toArray();
  }, [sakList]);

  return (
    <SearchableMultiSelect
      label="Saksnummer"
      options={options}
      value={selectedSaksIds}
      valueKey={getSaksnummer}
      formatOption={getSaksnummer}
      emptyLabel="Saksnummer"
      filterText={getSaksnummer}
      onChange={setSelectedSaksIds}
      style={{ gridArea: Fields.Saksnummer }}
      triggerSize="small"
      triggerVariant="tertiary"
      triggerDisplay="count"
      showSelectAll
    />
  );
};

const getSaksnummer = (saksnummer: string) => saksnummer;
