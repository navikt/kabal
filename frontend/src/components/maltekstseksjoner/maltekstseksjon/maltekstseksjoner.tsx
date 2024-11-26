import { CreateMaltekstseksjon } from '@app/components/maltekstseksjoner/create';
import { DragAndDropContextElement } from '@app/components/maltekstseksjoner/drag-and-drop/drag-context';
import { Maltekstseksjon } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon';
import { Filters } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-list-filters';
import { SetMaltekstseksjonLanguage } from '@app/components/set-redaktoer-language/set-maltekstseksjon-language';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { QueryKey, SortKey } from '@app/components/smart-editor-texts/sortable-header';
import { MaltekstseksjonList } from '@app/components/smart-editor-texts/text-list/text-list';
import { useGetMaltekstseksjonerQuery } from '@app/redux-api/maltekstseksjoner/queries';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import { SortOrder } from '@app/types/sort';
import { PuzzlePieceIcon } from '@navikt/aksel-icons';
import { HStack, Search } from '@navikt/ds-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';

export const Maltekstseksjoner = () => {
  const { id } = useParams();
  const { utfallIdList, templateSectionIdList, ytelseHjemmelIdList } = useTextQuery();
  const query: IGetMaltekstseksjonParams = {
    templateSectionIdList,
    ytelseHjemmelIdList,
    utfallIdList,
  };

  const { data: maltekstseksjoner = [], isLoading } = useGetMaltekstseksjonerQuery(query);
  const [searchParams, setSearchParams] = useSearchParams();

  const [rawSearch, setRawSearch] = useState('');

  const hasSelectedMaltekstseksjon = id !== undefined;

  return (
    <Container>
      <HStack as="header" justify="start" align="center" gap="4" marginBlock="0 2" gridColumn="header">
        <CreateMaltekstseksjon query={query} />
        <SetMaltekstseksjonLanguage />
      </HStack>

      <Filters />

      <StyledSearch
        variant="simple"
        size="small"
        label="Filtrer på navn"
        placeholder="Filtrer på navn"
        value={rawSearch}
        onChange={(v) => {
          if (rawSearch.length === 0 && v.length > 0) {
            searchParams.set(QueryKey.SORT, SortKey.SCORE);
            searchParams.set(QueryKey.ORDER, SortOrder.DESC);
            setSearchParams(searchParams);
          }

          setRawSearch(v);
        }}
      />
      <DragAndDropContextElement>
        <MaltekstseksjonList
          style={{ gridArea: 'list' }}
          data={maltekstseksjoner}
          isLoading={isLoading}
          filter={rawSearch}
        />

        {hasSelectedMaltekstseksjon ? (
          <Maltekstseksjon maltekstseksjonId={id} query={query} />
        ) : (
          <Placeholder>
            <PuzzlePieceIcon aria-hidden fontSize={400} />
          </Placeholder>
        )}
      </DragAndDropContextElement>
    </Container>
  );
};

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: var(--a-border-radius-medium);
  box-shadow: var(--a-shadow-medium);
  color: var(--a-surface-subtle);
  width: fit-content;
  min-width: 1330px;
  grid-area: content;
  margin-bottom: var(--a-spacing-1);
  margin-top: var(--a-spacing-1);
`;

const StyledSearch = styled(Search)`
  grid-area: search;
  padding-left: var(--a-spacing-1);
  padding-right: var(--a-spacing-1);
`;

const Container = styled.article`
  display: grid;
  grid-template-columns: 700px min-content;
  grid-template-rows: min-content min-content min-content 1fr;
  grid-template-areas: 'header content' 'filters content' 'search content' 'list content';
  column-gap: var(--a-spacing-2);
  height: 100%;
  overflow-y: hidden;
`;
