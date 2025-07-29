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
import { BoxNew, HGrid, HStack, Search, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

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
    <HGrid
      columns="700px min-content"
      style={{
        gridTemplateRows: 'min-content min-content min-content 1fr',
        gridTemplateAreas: '"header content" "filters content" "search content" "list content"',
      }}
      gap="1 2"
      height="100%"
      overflowY="hidden"
    >
      <HStack as="header" justify="start" align="center" gap="4" className="[grid-area:header]">
        <CreateMaltekstseksjon query={query} />
        <SetMaltekstseksjonLanguage />
      </HStack>

      <Filters />

      <Search
        variant="simple"
        size="small"
        label="Filtrer på navn"
        placeholder="Filtrer på navn"
        value={rawSearch}
        className="[grid-area:search]"
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
          className="[grid-area:list]"
          data={maltekstseksjoner}
          isLoading={isLoading}
          filter={rawSearch}
        />

        {hasSelectedMaltekstseksjon ? (
          <Maltekstseksjon maltekstseksjonId={id} query={query} />
        ) : (
          <VStack
            asChild
            align="center"
            justify="center"
            className="[grid-area:content]"
            minWidth="1330px"
            width="fit-content"
          >
            <BoxNew borderRadius="medium" shadow="dialog" marginBlock="1" className="text-ax-text-neutral-decoration">
              <PuzzlePieceIcon aria-hidden fontSize={400} />
            </BoxNew>
          </VStack>
        )}
      </DragAndDropContextElement>
    </HGrid>
  );
};
