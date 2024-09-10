import { PuzzlePieceIcon } from '@navikt/aksel-icons';
import { Search } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { CreateMaltekstseksjon } from '@app/components/maltekstseksjoner/create';
import { Maltekstseksjon } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon';
import { Filters } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-list-filters';
import { MaltekstseksjontListItem } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-list-item';
import { SetMaltekstseksjonLanguage } from '@app/components/set-redaktoer-language/set-maltekstseksjon-language';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { ShowDepublished } from '@app/components/smart-editor-texts/show-depublished';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useGetMaltekstseksjonerQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import { DragAndDropContextElement } from '../drag-and-drop/drag-context';
import { List } from './common';

export const MaltekstseksjonList = () => {
  const { id } = useParams();
  const { utfallIdList, templateSectionIdList, ytelseHjemmelIdList } = useTextQuery();
  const [params] = useSearchParams();
  const query: IGetMaltekstseksjonParams = {
    templateSectionIdList,
    ytelseHjemmelIdList,
    utfallIdList,
    trash: params.get('trash') === 'true',
  };

  const { data: malteksterseksjoner = [] } = useGetMaltekstseksjonerQuery(query);

  const [rawSearch, setRawSearch] = useState('');

  const selectedMaltekstseksjon = malteksterseksjoner.find((maltekst) => maltekst.id === id);
  const hasSelectedMaltekstseksjon = selectedMaltekstseksjon !== undefined;

  const filteredMaltekstseksjoner = useMemo(() => {
    const regex = stringToRegExp(rawSearch);

    return malteksterseksjoner.filter(({ title }) => regex.test(title));
  }, [malteksterseksjoner, rawSearch]);

  return (
    <Container>
      <Header>
        <CreateMaltekstseksjon query={query} />
        <SetMaltekstseksjonLanguage />
        <ShowDepublished />
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
  margin-bottom: 4px;
  margin-top: 4px;
  margin-right: 4px;
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
  column-gap: 16px;
  margin-bottom: 8px;
  grid-area: header;
`;
