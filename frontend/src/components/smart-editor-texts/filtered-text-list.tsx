import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { QueryKey, SortKey } from '@app/components/smart-editor-texts/sortable-header';
import { useGetTextsQuery } from '@app/redux-api/texts/queries';
import type { TextTypes } from '@app/types/common-text-types';
import { SortOrder } from '@app/types/sort';
import { Search } from '@navikt/ds-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';
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
    <Container>
      <Header>
        <Filters textType={textType} />
        <Row>
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
        </Row>
      </Header>
      <StandaloneTextList filter={filter} data={data} isLoading={isLoading} textType={textType} />
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--a-spacing-1);
`;

const Container = styled.div`
  row-gap: var(--a-spacing-2);
  z-index: 22;
  overflow: visible;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-2);
  position: relative;
  background-color: var(--a-bg-default);
`;
