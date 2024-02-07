import { FileTextIcon } from '@navikt/aksel-icons';
import { Loader } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { StatusTag } from '@app/components/maltekstseksjoner/status-tag';
import { sortWithOrdinals } from '@app/functions/sort-with-ordinals/sort-with-ordinals';
import { useGetTextsQuery } from '@app/redux-api/texts/queries';
import { TextTypes } from '@app/types/common-text-types';
import { SortOrder } from '@app/types/sort';
import { ModifiedCreatedDateTime } from '../datetime/datetime';
import { getPathPrefix } from './functions/get-path-prefix';
import { useTextQuery } from './hooks/use-text-query';
import { QueryKey, SortKey, SortableHeader } from './sortable-header';

interface TextListProps {
  textType: TextTypes;
  filter: RegExp;
}

export const TextList = ({ textType, filter }: TextListProps) => {
  const textQuery = useTextQuery();
  const { data = [], isLoading } = useGetTextsQuery(textQuery);
  const query = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const sort = useMemo(
    () => (searchParams.get(QueryKey.SORT) === SortKey.MODIFIED ? SortKey.MODIFIED : SortKey.TITLE),
    [searchParams],
  );
  const order = useMemo(
    () => (searchParams.get(QueryKey.ORDER) !== SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC),
    [searchParams],
  );

  const texts = useMemo(
    () =>
      data
        .filter(({ title }) => filter.test(title))
        .sort((a, b) => {
          const isAsc = order === SortOrder.ASC;

          switch (sort) {
            case SortKey.MODIFIED:
              return isAsc ? a.modified.localeCompare(b.modified) : b.modified.localeCompare(a.modified);
            case SortKey.TITLE:
            default:
              return isAsc ? sortWithOrdinals(a.title, b.title) : sortWithOrdinals(b.title, a.title);
          }
        }),
    [order, data, filter, sort],
  );

  if (isLoading || typeof data === 'undefined') {
    return (
      <LoaderOverlay>
        <Loader size="large" />
      </LoaderOverlay>
    );
  }

  return (
    <Container>
      <StyledHeaders>
        <SortableHeader label="Tittel" sortKey={SortKey.TITLE} querySortKey={sort} querySortOrder={order} />
        <div />
        <SortableHeader label="Sist endret" sortKey={SortKey.MODIFIED} querySortKey={sort} querySortOrder={order} />
      </StyledHeaders>
      <StyledList>
        {texts.map(({ id, title, modified, created, publishedDateTime }) => (
          <ListItem key={id} $active={query.id === id}>
            <StyledLink to={`${getPathPrefix(textType)}/${id}${window.location.search}`}>
              <StyledTitle>
                <StyledTitleIcon />
                <StyledTitleText title={getTitle(title)}>{getTitle(title)}</StyledTitleText>
              </StyledTitle>

              <StatusTag hasDraft={publishedDateTime === null} />
              <ModifiedCreatedDateTime modified={modified} created={created} />
            </StyledLink>
          </ListItem>
        ))}
      </StyledList>
    </Container>
  );
};

const getTitle = (title: string) => (title.trim().length === 0 ? '<Ingen tittel>' : title);

const LoaderOverlay = styled.div`
  width: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fafafa;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  width: 700px;
  flex-grow: 1;
`;

const StyledHeaders = styled.div`
  display: grid;
  grid-template-columns: 1fr 70px 160px;
  gap: 8px;
  padding-left: 8px;
  padding-right: 8px;
  position: sticky;
  top: 0;
  background-color: #fff;
  box-shadow: 0px 5px 5px -3px rgb(0, 0, 0, 20%);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li<{ $active: boolean }>`
  background-color: ${({ $active }) => ($active ? 'var(--a-blue-100)' : '#fff')};
  transition-property: background-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  border-radius: var(--a-border-radius-medium);

  &:hover {
    background-color: ${({ $active }) => ($active ? 'var(--a-blue-100)' : 'var(--a-blue-50)')};
  }
`;

const StyledLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 70px 160px;
  gap: 8px;
  align-content: center;
  align-items: center;
  width: 100%;
  color: inherit;
  text-decoration: none;
  padding: 8px;
`;

const StyledTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledTitleIcon = styled(FileTextIcon)`
  flex-shrink: 0;
`;

const StyledTitleText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
