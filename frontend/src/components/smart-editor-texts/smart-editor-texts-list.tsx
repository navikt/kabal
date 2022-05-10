import { FileContent } from '@navikt/ds-icons';
import { Loader, TextField } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { stringToRegExp } from '../../functions/string-to-regex';
import { useGetTextsQuery } from '../../redux-api/texts';
import { TextTypes } from '../../types/texts/texts';
import { DateTime } from '../datetime/datetime';
import { Filters } from './filters';
import { getPathPrefix } from './functions/get-path-prefix';
import { useTextQuery } from './hooks/use-text-query';
import { LimitWarning } from './warning';

interface Props {
  textType: TextTypes;
}

export const FilteredTextList = ({ textType }: Props) => {
  const [filter, setFilter] = useState<string>('');

  const filterRegex = useMemo(() => stringToRegExp(filter), [filter]);

  return (
    <Container>
      <Header>
        <Filters />
        <TextField
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrer på tittel"
          label="Tittel"
          size="small"
          hideLabel
        />
      </Header>
      <TextList textType={textType} filter={filterRegex} />
    </Container>
  );
};

interface TextListProps extends Props {
  filter: RegExp;
}

const TextList = ({ textType, filter }: TextListProps) => {
  const textQuery = useTextQuery();
  const { data, isLoading } = useGetTextsQuery(textQuery);
  const query = useParams<{ id: string }>();

  const texts = useMemo(() => data?.filter(({ title }) => filter.test(title)) ?? [], [data, filter]);

  if (isLoading || typeof data === 'undefined') {
    return (
      <LoaderOverlay>
        <Loader size="large" />
      </LoaderOverlay>
    );
  }

  const prefix = getPathPrefix(textType);

  return (
    <StyledList>
      {texts.map(({ id, title, modified, created, hjemler, ytelser, utfall, enheter, sections, templates }) => (
        <ListItem key={id} active={query.id === id}>
          <StyledLink to={`${prefix}/${id}`}>
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
  );
};

const getTitle = (title: string) => (title.trim().length === 0 ? '<Ingen tittel>' : title);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 0;
  background-color: #fff;
  box-shadow: 0px 5px 5px -3px rgb(0, 0, 0, 20%);
  border-radius: 4px;
`;

const LoaderOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fafafa;
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
