import { StatusTag } from '@app/components/maltekstseksjoner/status-tag';
import { StatusFilter, useStatusFilter } from '@app/components/smart-editor-texts/status-filter/status-filter';
import { useFilteredAndSorted, useOrder, useSort } from '@app/components/smart-editor-texts/text-list/hooks';
import {
  Container,
  ListItem,
  LoaderOverlay,
  StyledHeaders,
  StyledLink,
  StyledList,
  StyledTitle,
  StyledTitleIcon,
  StyledTitleText,
} from '@app/components/smart-editor-texts/text-list/styled-components';
import { isGodFormulering, isPlainText, isRegelverk, isRichText } from '@app/functions/is-rich-plain-text';
import { usePrevious } from '@app/hooks/use-previous';
import { useGetTextsQuery } from '@app/redux-api/texts/queries';
import { REGELVERK_TYPE, type TextTypes } from '@app/types/common-text-types';
import { SortOrder } from '@app/types/sort';
import { type Language, UNTRANSLATED } from '@app/types/texts/language';
import type { IText } from '@app/types/texts/responses';
import { PercentIcon } from '@navikt/aksel-icons';
import { Loader } from '@navikt/ds-react';
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getTextAsString } from '../../../plate/functions/get-text-string';
import { DateTime } from '../../datetime/datetime';
import { getPathPrefix } from '../functions/get-path-prefix';
import { useTextQuery } from '../hooks/use-text-query';
import { QueryKey, SortKey, SortableHeader } from '../sortable-header';

interface TextListProps {
  textType: TextTypes;
  filter: string;
  language: Language;
}

const getString = (text: IText, language: Language) => {
  if (isRichText(text) || isGodFormulering(text)) {
    const richText = text.richText[language];

    if (richText === null) {
      return null;
    }

    return getTextAsString(richText);
  }

  if (isRegelverk(text)) {
    return getTextAsString(text.richText[UNTRANSLATED]);
  }

  if (isPlainText(text)) {
    return text.plainText[language];
  }

  return null;
};

export const TextList = ({ textType, filter, language }: TextListProps) => {
  const textQuery = useTextQuery();
  const { data = [], isLoading } = useGetTextsQuery(textQuery);
  const query = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const prevFilter = usePrevious(filter);

  const [statusFilter] = useStatusFilter();
  const getFilterText = (text: IText, language: Language) => text.title + (getString(text, language) ?? '');
  const sortedTexts = useFilteredAndSorted(data, statusFilter, filter, getFilterText);

  useEffect(() => {
    if (prevFilter?.length === 0 && filter.length > 0) {
      searchParams.set(QueryKey.SORT, SortKey.SCORE);
      searchParams.set(QueryKey.ORDER, SortOrder.DESC);
      setSearchParams(searchParams);
    }
  }, [filter, prevFilter?.length, searchParams, setSearchParams]);

  if (isLoading || typeof data === 'undefined') {
    return (
      <LoaderOverlay>
        <Loader size="large" />
      </LoaderOverlay>
    );
  }

  return (
    <Container>
      <Headers />
      <StyledList>
        {sortedTexts.map(({ id, title, modified, publishedDateTime, score, published }) => (
          <ListItem key={id} $active={query.id === id}>
            <StyledLink to={getLink(textType, language, id)}>
              <StyledTitle>
                <StyledTitleIcon />
                <StyledTitleText title={getTitle(title)}>{getTitle(title)}</StyledTitleText>
              </StyledTitle>

              <StatusTag publishedDateTime={publishedDateTime} published={published} />
              <DateTime dateTime={modified} />
              <span>{score.toFixed(0)} %</span>
            </StyledLink>
          </ListItem>
        ))}
      </StyledList>
    </Container>
  );
};

const Headers = () => {
  const sort = useSort();
  const order = useOrder();

  return (
    <StyledHeaders>
      <SortableHeader label="Tittel" sortKey={SortKey.TITLE} querySortKey={sort} querySortOrder={order} />
      <StatusFilter />
      <SortableHeader label="Sist endret" sortKey={SortKey.MODIFIED} querySortKey={sort} querySortOrder={order} />
      <SortableHeader
        label={
          <span style={{ display: 'flex', alignContent: 'center' }}>
            <PercentIcon aria-hidden fontSize={18} />
          </span>
        }
        sortKey={SortKey.SCORE}
        querySortKey={sort}
        querySortOrder={order}
        title="Sorter på søkeresultat"
      />
    </StyledHeaders>
  );
};

const getLink = (textType: TextTypes, language: Language, id: string) => {
  if (textType === REGELVERK_TYPE) {
    return `${getPathPrefix(textType)}/${id}${window.location.search}`;
  }

  return `${getPathPrefix(textType)}/${language}/${id}${window.location.search}`;
};

const getTitle = (title: string) => (title.trim().length === 0 ? '<Ingen tittel>' : title);
