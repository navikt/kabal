import { MaltekstseksjontListItem } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-list-item';
import { StatusTag } from '@app/components/maltekstseksjoner/status-tag';
import { getPathPrefix } from '@app/components/smart-editor-texts/functions/get-path-prefix';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { StatusFilter, useStatusFilter } from '@app/components/smart-editor-texts/status-filter/status-filter';
import { useFilteredAndSorted, useOrder, useSort } from '@app/components/smart-editor-texts/text-list/hooks';
import {
  ListItem,
  StyledHeaders,
  StyledLink,
  StyledTitleIcon,
  StyledTitleText,
} from '@app/components/smart-editor-texts/text-list/styled-components';
import {
  isListGodFormulering,
  isListPlainText,
  isListRegelverk,
  isListRichText,
} from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { getTextAsString } from '@app/plate/functions/get-text-string';
import { useGetMaltekstseksjonQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { type IGetMaltekstseksjonParams, REGELVERK_TYPE, type TextTypes } from '@app/types/common-text-types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { type Language, UNTRANSLATED } from '@app/types/texts/language';
import type { ListText } from '@app/types/texts/responses';
import { PercentIcon, TasklistIcon } from '@navikt/aksel-icons';
import { Box, HStack, Loader, VStack } from '@navikt/ds-react';
import { useParams } from 'react-router-dom';
import { DateTime } from '../../datetime/datetime';
import { SortableHeader, SortKey } from '../sortable-header';

interface StandaloneTextListProps {
  filter: string;
  data: ListText[];
  isLoading: boolean;
  style?: React.CSSProperties;
  textType: TextTypes;
}

const getString = (text: ListText, language: Language) => {
  if (isListRichText(text) || isListGodFormulering(text)) {
    const richText = text.richText[language];

    if (richText === null) {
      return null;
    }

    return getTextAsString(richText);
  }

  if (isListRegelverk(text)) {
    return getTextAsString(text.richText[UNTRANSLATED]);
  }

  if (isListPlainText(text)) {
    return text.plainText[language];
  }

  return null;
};

export const StandaloneTextList = ({ filter, data, isLoading, style, textType }: StandaloneTextListProps) => {
  const language = useRedaktoerLanguage();
  const query = useParams<{ id: string }>();
  const [statusFilter] = useStatusFilter();
  const getFilterText = (text: ListText, language: Language) => text.title + (getString(text, language) ?? '');
  const sortedTexts = useFilteredAndSorted(data, statusFilter, filter, getFilterText, ({ modified }) => modified);

  if (isLoading || typeof data === 'undefined') {
    return (
      <HStack asChild align="center" justify="center" width="700px" height="100%">
        <Box background="bg-default">
          <Loader size="large" />
        </Box>
      </HStack>
    );
  }

  return (
    <VStack height="100%" width="700px" overflowY="auto" flexGrow="1" style={style}>
      <Headers />
      <VStack as="ul" gap="1 0" width="100%" padding="0" margin="0" className="list-none">
        {sortedTexts.map(({ id, title, modified, publishedDateTime, published, score }) => (
          <ListItem key={id} $active={query.id === id}>
            <StyledLink to={getStandaloneTextLink(textType, language, id)}>
              <HStack align="center" gap="05" overflow="hidden" wrap={false} className="whitespace-nowrap">
                <StyledTitleIcon />
                <StyledTitleText title={getTitle(title)}>{getTitle(title)}</StyledTitleText>
              </HStack>

              <StatusTag publishedDateTime={publishedDateTime} published={published} />
              <DateTime dateTime={modified} />
              <span>{score.toFixed(0)} %</span>
            </StyledLink>
          </ListItem>
        ))}
      </VStack>
    </VStack>
  );
};

interface MaltekstseksjonListProps {
  filter: string;
  data: IMaltekstseksjon[];
  isLoading: boolean;
  className?: string;
}

export const MaltekstseksjonList = ({ filter, data, isLoading, className }: MaltekstseksjonListProps) => {
  const [statusFilter] = useStatusFilter();
  const sortedMaltekstseksjonList = useFilteredAndSorted(
    data,
    statusFilter,
    filter,
    (t) => t.title,
    (t) => t.modifiedOrTextsModified,
  );

  if (isLoading || data === undefined) {
    return (
      <HStack asChild align="center" justify="center" width="700px" height="100%">
        <Box background="bg-default">
          <Loader size="3xlarge" />
        </Box>
      </HStack>
    );
  }

  return (
    <VStack height="100%" width="700px" overflowY="auto" flexGrow="1" className={className}>
      <Headers />
      <VStack as="ul" gap="1 0" width="100%" padding="0" margin="0" className="list-none">
        {sortedMaltekstseksjonList.map(({ id, score }) => (
          <MaltekstseksjonItem key={id} maltekstseksjonId={id} score={score} />
        ))}
      </VStack>
    </VStack>
  );
};

interface MaltekstseksjonItemProps {
  maltekstseksjonId: string;
  score: number;
}

const MaltekstseksjonItem = ({ maltekstseksjonId, score }: MaltekstseksjonItemProps) => {
  const language = useRedaktoerLanguage();
  const query = useParams<{ id: string }>();
  const { data: maltekstseksjon } = useGetMaltekstseksjonQuery(maltekstseksjonId);
  const { utfallIdList, templateSectionIdList, ytelseHjemmelIdList } = useTextQuery();

  if (maltekstseksjon === undefined) {
    return null;
  }

  const maltekstseksjonQuery: IGetMaltekstseksjonParams = {
    templateSectionIdList,
    ytelseHjemmelIdList,
    utfallIdList,
  };

  const getLink = (maltekstseksjon: IMaltekstseksjon, language: Language) => {
    const [firstTextId] = maltekstseksjon.textIdList;
    const prefix = `/maltekstseksjoner/${language}/${maltekstseksjon.id}/versjoner/${maltekstseksjon.versionId}`;

    return firstTextId === undefined
      ? `${prefix}${window.location.search}`
      : `${prefix}/tekster/${firstTextId}${window.location.search}`;
  };

  const { id, title, publishedDateTime, modifiedOrTextsModified, published } = maltekstseksjon;

  return (
    <MaltekstseksjontListItem key={id} query={maltekstseksjonQuery} activeId={query.id} maltekstseksjonId={id}>
      <StyledLink to={getLink(maltekstseksjon, language)}>
        <HStack align="center" gap="05" overflow="hidden" wrap={false} className="whitespace-nowrap">
          <TasklistIcon aria-hidden className="shrink-0" />
          <StyledTitleText title={getTitle(title)}>{getTitle(title)}</StyledTitleText>
        </HStack>

        <StatusTag publishedDateTime={publishedDateTime} published={published} />
        <DateTime dateTime={modifiedOrTextsModified} />
        <span>{score.toFixed(0)} %</span>
      </StyledLink>
    </MaltekstseksjontListItem>
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
          <HStack align="center">
            <PercentIcon aria-hidden fontSize={18} />
          </HStack>
        }
        sortKey={SortKey.SCORE}
        querySortKey={sort}
        querySortOrder={order}
        title="Sorter på søkeresultat"
      />
    </StyledHeaders>
  );
};

const getStandaloneTextLink = (textType: TextTypes, language: Language, id: string) => {
  if (textType === REGELVERK_TYPE) {
    return `${getPathPrefix(textType)}/${id}${window.location.search}`;
  }

  return `${getPathPrefix(textType)}/${language}/${id}${window.location.search}`;
};

const getTitle = (title: string) => (title.trim().length === 0 ? '<Ingen tittel>' : title);
