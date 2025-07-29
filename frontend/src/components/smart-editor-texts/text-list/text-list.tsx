import { MaltekstseksjontLinkListItem } from '@app/components/maltekstseksjoner/maltekstseksjon/maltekstseksjon-link-list-item';
import { StatusTag } from '@app/components/maltekstseksjoner/status-tag';
import { getPathPrefix } from '@app/components/smart-editor-texts/functions/get-path-prefix';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { StatusFilter, useStatusFilter } from '@app/components/smart-editor-texts/status-filter/status-filter';
import { useFilteredAndSorted, useOrder, useSort } from '@app/components/smart-editor-texts/text-list/hooks';
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
import { FileTextIcon, PercentIcon, TasklistIcon } from '@navikt/aksel-icons';
import { BoxNew, HGrid, HStack, Loader, VStack } from '@navikt/ds-react';
import { Link, useParams } from 'react-router-dom';
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

  if (isLoading || data === undefined) {
    return (
      <HStack asChild align="center" justify="center" width="700px" height="100%">
        <BoxNew background="default">
          <Loader size="large" />
        </BoxNew>
      </HStack>
    );
  }

  return (
    <VStack height="100%" width="700px" overflowY="auto" flexGrow="1" style={style}>
      <Headers />

      <VStack as="ul" gap="1 0" width="100%" padding="0" margin="0" className="list-none">
        {sortedTexts.map(({ id, title, modified, publishedDateTime, published, score }) => (
          <BoxNew
            as="li"
            key={id}
            background={query.id === id ? 'accent-soft' : 'default'}
            borderRadius="medium"
            style={{
              ['--hover-background' as string]:
                query.id === id ? 'var(--ax-bg-accent-moderate)' : 'var(--ax-bg-accent-soft)',
            }}
            className="transition-colors duration-200 ease-in-out hover:bg-(--hover-background)"
          >
            <CustomLink to={getStandaloneTextLink(textType, language, id)}>
              <HStack align="center" gap="05" overflow="hidden" wrap={false} className="whitespace-nowrap">
                <FileTextIcon aria-hidden className="shrink-0" />
                <span className="truncate" title={getTitle(title)}>
                  {getTitle(title)}
                </span>
              </HStack>

              <StatusTag publishedDateTime={publishedDateTime} published={published} />
              <DateTime dateTime={modified} />
              <span>{score.toFixed(0)} %</span>
            </CustomLink>
          </BoxNew>
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
        <BoxNew background="default">
          <Loader size="3xlarge" />
        </BoxNew>
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
    <MaltekstseksjontLinkListItem key={id} query={maltekstseksjonQuery} activeId={query.id} maltekstseksjonId={id}>
      <CustomLink to={getLink(maltekstseksjon, language)}>
        <HStack align="center" gap="05" overflow="hidden" wrap={false} className="whitespace-nowrap">
          <TasklistIcon aria-hidden className="shrink-0" />
          <span className="truncate" title={getTitle(title)}>
            {getTitle(title)}
          </span>
        </HStack>

        <StatusTag publishedDateTime={publishedDateTime} published={published} />
        <DateTime dateTime={modifiedOrTextsModified} />
        <span>{score.toFixed(0)} %</span>
      </CustomLink>
    </MaltekstseksjontLinkListItem>
  );
};

const Headers = () => {
  const sort = useSort();
  const order = useOrder();

  return (
    <HGrid asChild columns={COLUMNS} gap="2" position="sticky" top="0" className="z-1">
      <BoxNew background="default" shadow="dialog" borderRadius="0 0 medium medium" paddingInline="2">
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
      </BoxNew>
    </HGrid>
  );
};

const COLUMNS = '1fr 120px 135px 48px';

interface CustomLinkProps {
  children: React.ReactNode;
  to: string;
}

const CustomLink = ({ children, to }: CustomLinkProps) => (
  <HGrid
    as={Link}
    to={to}
    columns={COLUMNS}
    gap="2"
    align="center"
    width="100%"
    padding="space-8"
    className="text-[inherit] no-underline"
  >
    {children}
  </HGrid>
);

const getStandaloneTextLink = (textType: TextTypes, language: Language, id: string) => {
  if (textType === REGELVERK_TYPE) {
    return `${getPathPrefix(textType)}/${id}${window.location.search}`;
  }

  return `${getPathPrefix(textType)}/${language}/${id}${window.location.search}`;
};

const getTitle = (title: string) => (title.trim().length === 0 ? '<Ingen tittel>' : title);
