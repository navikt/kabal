import { StatusTag } from '@app/components/maltekstseksjoner/status-tag';
import { getPathPrefix } from '@app/components/smart-editor-texts/functions/get-path-prefix';
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
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { getTextAsString } from '@app/plate/functions/get-text-string';
import { REGELVERK_TYPE, type TextTypes } from '@app/types/common-text-types';
import { type Language, UNTRANSLATED } from '@app/types/texts/language';
import type { IText } from '@app/types/texts/responses';
import { PercentIcon } from '@navikt/aksel-icons';
import { Loader } from '@navikt/ds-react';
import { useParams } from 'react-router-dom';
import { DateTime } from '../../datetime/datetime';
import { SortKey, SortableHeader } from '../sortable-header';

interface StandaloneTextListProps {
  filter: string;
  data: IText[];
  isLoading: boolean;
  style?: React.CSSProperties;
  textType: TextTypes;
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

export const StandaloneTextList = ({ filter, data, isLoading, style, textType }: StandaloneTextListProps) => {
  const language = useRedaktoerLanguage();
  const query = useParams<{ id: string }>();
  const [statusFilter] = useStatusFilter();
  const getFilterText = (text: IText, language: Language) => text.title + (getString(text, language) ?? '');
  const sortedTexts = useFilteredAndSorted(data, statusFilter, filter, getFilterText);

  if (isLoading || typeof data === 'undefined') {
    return (
      <LoaderOverlay>
        <Loader size="large" />
      </LoaderOverlay>
    );
  }

  return (
    <Container style={style}>
      <Headers />
      <StyledList>
        {sortedTexts.map(({ id, title, modified, publishedDateTime, published, score }) => (
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
