import { FileContent } from '@navikt/ds-icons';
import { Loader } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetTextsQuery } from '../../redux-api/texts';
import { TextTypes } from '../../types/texts/texts';
import { DateTime } from '../datetime/datetime';
import { getPathPrefix } from './functions/get-path-prefix';
import { useTextQuery } from './hooks/use-text-query';
import { QueryKey, SortKey, SortOrder, SortableHeader } from './sortable-header';
import { LimitWarning } from './warning';

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
    [searchParams]
  );
  const order = useMemo(
    () => (searchParams.get(QueryKey.ORDER) !== SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC),
    [searchParams]
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
              return isAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
          }
        }),
    [order, data, filter, sort]
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
        <SortableHeader label="Sist endret" sortKey={SortKey.MODIFIED} querySortKey={sort} querySortOrder={order} />
      </StyledHeaders>
      <StyledList>
        {texts.map(({ id, title, modified, created, hjemler, ytelser, utfall, enheter, sections, templates }) => (
          <ListItem key={id} active={query.id === id}>
            <StyledLink to={`${getPathPrefix(textType)}/${id}`}>
              <StyledTitle>
                <StyledTitleIcon />
                <StyledTitleText title={getTitle(title)}>{getTitle(title)}</StyledTitleText>
              </StyledTitle>
              <DateTime modified={modified} created={created} />
              <LimitWarning
                hjemler={hjemler}
                ytelser={ytelser}
                utfall={utfall}
                enheter={enheter}
                sections={sections}
                templates={templates}
              />
            </StyledLink>
          </ListItem>
        ))}
      </StyledList>
    </Container>
  );
};

const getTitle = (title: string) => (title.trim().length === 0 ? '<Ingen tittel>' : title);

const LoaderOverlay = styled.div`
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
`;

const StyledHeaders = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 0;
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

const ListItem = styled.li<{ active: boolean }>`
  background-color: ${({ active }) => (active ? 'var(--navds-global-color-blue-100)' : '#fff')};
  transition-property: background-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  border-radius: 4px;

  :hover {
    background-color: ${({ active }) =>
      active ? 'var(--navds-global-color-blue-100)' : 'var(--navds-global-color-blue-50)'};
  }
`;

const StyledLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 160px 16px;
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

const StyledTitleIcon = styled(FileContent)`
  flex-shrink: 0;
`;

const StyledTitleText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
