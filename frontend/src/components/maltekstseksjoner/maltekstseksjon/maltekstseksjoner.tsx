import { CreateMaltekstseksjon } from '@app/components/maltekstseksjoner/create';
import { Maltekstseksjon } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon';
import { Filters } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-list-filters';
import { MaltekstseksjontListItem } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-list-item';
import { SetMaltekstseksjonLanguage } from '@app/components/set-redaktoer-language/set-maltekstseksjon-language';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { filterByStatus, useStatusFilter } from '@app/components/smart-editor-texts/status-filter/status-filter';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useGetMaltekstseksjonerQuery } from '@app/redux-api/maltekstseksjoner/queries';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import { PuzzlePieceIcon } from '@navikt/aksel-icons';
import { Search } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { DragAndDropContextElement } from '../drag-and-drop/drag-context';
import { List } from './common';

export const Maltekstseksjoner = () => {
  const { id } = useParams();
  const { utfallIdList, templateSectionIdList, ytelseHjemmelIdList } = useTextQuery();
  const query: IGetMaltekstseksjonParams = {
    templateSectionIdList,
    ytelseHjemmelIdList,
    utfallIdList,
  };
  const [statusFilter] = useStatusFilter();

  const { data: malteksterseksjoner = [] } = useGetMaltekstseksjonerQuery(query);

  const [rawSearch, setRawSearch] = useState('');

  const selectedMaltekstseksjon = malteksterseksjoner.find((maltekst) => maltekst.id === id);
  const hasSelectedMaltekstseksjon = selectedMaltekstseksjon !== undefined;

  const filteredMaltekstseksjoner = useMemo(() => {
    const regex = stringToRegExp(rawSearch);

    return malteksterseksjoner.filter((m) => filterByStatus(statusFilter, m) && regex.test(m.title));
  }, [malteksterseksjoner, rawSearch, statusFilter]);

  return (
    <Container>
      <Header>
        <CreateMaltekstseksjon query={query} />
        <SetMaltekstseksjonLanguage />
      </Header>

      <Filters />

      <StyledSearch
        variant="simple"
        size="small"
        label="Filtrer på navn"
        placeholder="Filtrer på navn"
        value={rawSearch}
        onChange={setRawSearch}
      />

      <DragAndDropContextElement>
        <StyledList>
          {filteredMaltekstseksjoner.map((maltekstseksjon) => (
            <MaltekstseksjontListItem
              key={maltekstseksjon.id}
              maltekstseksjon={maltekstseksjon}
              activeId={id}
              query={query}
            />
          ))}
        </StyledList>
        {hasSelectedMaltekstseksjon ? (
          <Maltekstseksjon maltekstseksjon={selectedMaltekstseksjon} query={query} />
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

const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  row-gap: var(--a-spacing-1);
  margin-top: var(--a-spacing-1);
  padding: var(--a-spacing-1);
  grid-area: list;
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

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  column-gap: var(--a-spacing-4);
  margin-bottom: var(--a-spacing-2);
  grid-area: header;
`;