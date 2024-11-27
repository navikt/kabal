import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { QueryKey, SortKey } from '@app/components/smart-editor-texts/sortable-header';
import { useGetTextsQuery } from '@app/redux-api/texts/queries';
import type { TextTypes } from '@app/types/common-text-types';
import { SortOrder } from '@app/types/sort';
import { HStack, Search, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filters } from './filters';
import { StandaloneTextList } from './text-list/text-list';

interface Props {
  textType: TextTypes;
}

export const FilteredTextList = ({ textType }: Props) => {
  const [filter, setFilter] = useState<string>('');
  const textQuery = useTextQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data = [], isLoading } = useGetTextsQuery(textQuery);

  return (
    <VStack gap="2" overflow="visible" gridColumn="list" overflowY="auto">
      <VStack gap="2" position="relative">
        <Filters textType={textType} />

        <HStack gap="1">
          <Search
            value={filter}
            onChange={(v) => {
              if (filter.length === 0 && v.length > 0) {
                searchParams.set(QueryKey.SORT, SortKey.SCORE);
                searchParams.set(QueryKey.ORDER, SortOrder.DESC);
                setSearchParams(searchParams);
              }

              setFilter(v);
            }}
            placeholder="Filtrer på tittel og innhold"
            label="Filtrer på tittel og innhold"
            size="small"
            variant="simple"
            hideLabel
            spellCheck
          />
        </HStack>
      </VStack>

      <StandaloneTextList filter={filter} data={data} isLoading={isLoading} textType={textType} />
    </VStack>
  );
};
