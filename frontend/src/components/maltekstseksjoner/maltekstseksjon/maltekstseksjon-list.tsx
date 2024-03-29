import { PuzzlePieceIcon } from '@navikt/aksel-icons';
import { Search } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { CreateMaltekst } from '@app/components/maltekstseksjoner/create';
import { Maltekstseksjon } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon';
import { Filters } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-list-filters';
import { MaltekstseksjontListItem } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-list-item';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useGetMaltekstseksjonerQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { IGetTextsParams } from '@app/types/maltekstseksjoner/params';
import { DragAndDropContextElement } from '../drag-and-drop/drag-context';
import { List } from './common';

export const MaltekstseksjonList = () => {
  const { id } = useParams();
  const { utfallIdList, templateSectionIdList, ytelseHjemmelIdList } = useTextQuery();
  const query: IGetTextsParams = { templateSectionIdList, ytelseHjemmelIdList, utfallIdList };
  const { data: malteksterseksjoner = [] } = useGetMaltekstseksjonerQuery(query);

  const [rawSearch, setRawSearch] = useState('');

  const selectedMaltekstseksjon = malteksterseksjoner.find((maltekst) => maltekst.id === id);
  const hasSelectedMaltekstseksjon = selectedMaltekstseksjon !== undefined;

  const filteredMaltekster = useMemo(() => {
    const regex = stringToRegExp(rawSearch);

    return malteksterseksjoner.filter(({ title }) => regex.test(title));
  }, [malteksterseksjoner, rawSearch]);

  return (
    <Container>
      <Header>
        <CreateMaltekst query={query} />
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
          {filteredMaltekster.map((maltekst) => (
            <MaltekstseksjontListItem key={maltekst.id} maltekstseksjon={maltekst} activeId={id} query={query} />
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
  width: 1330px;
  grid-area: content;
  margin-bottom: 4px;
  margin-top: 4px;
`;

const StyledSearch = styled(Search)`
  grid-area: search;
  padding-left: 4px;
  padding-right: 4px;
`;

const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  row-gap: 4px;
  margin-top: 4px;
  padding: 4px;
  grid-area: list;
`;

const Container = styled.article`
  display: grid;
  grid-template-columns: 700px min-content;
  grid-template-rows: min-content min-content min-content 1fr;
  grid-template-areas: 'header content' 'filters content' 'search content' 'list content';
  column-gap: 8px;
  height: 100%;
  overflow-y: hidden;
`;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  column-gap: 8px;
  margin-bottom: 8px;
  grid-area: header;
`;
