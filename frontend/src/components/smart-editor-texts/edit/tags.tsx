import React from 'react';
import { styled } from 'styled-components';
import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import { ALL_TEMPLATES_LABEL } from '@app/components/smart-editor-texts/get-template-options';
import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import { useEnhetNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
import { useUtfallNameOrLoading } from '@app/hooks/use-utfall-name';
import { TEMPLATE_MAP } from '@app/plate/templates/templates';
import { useKabalYtelserLatest } from '@app/simple-api-state/use-kodeverk';
import { AppQuery, PlainTextTypes, RichTextTypes } from '@app/types/common-text-types';
import { IText } from '@app/types/texts/responses';
import { CustomTag, ResolvedTags } from '../../tags/resolved-tag';

export const Tags = ({
  ytelseHjemmelIdList: ytelseHjemmelList,
  utfallIdList: utfall,
  enhetIdList: enheter,
  templateSectionIdList: templateSectionList,
  textType,
}: IText) => {
  const isHeaderFooter = textType === PlainTextTypes.HEADER || textType === PlainTextTypes.FOOTER;
  const hasFixedLocation = isHeaderFooter || textType === RichTextTypes.REGELVERK;

  return (
    <TagContainer>
      {isHeaderFooter || hasFixedLocation ? null : (
        <TagList
          variant="templateSectionIdList"
          noneLabel="Ingen maler eller seksjoner"
          ids={templateSectionList}
          useName={getTemaplateAndSectionName}
        />
      )}
      {isHeaderFooter ? null : (
        <TagList
          variant="ytelseHjemmelIdList"
          noneLabel="Alle ytelser og hjemler"
          ids={ytelseHjemmelList}
          useName={useYtelseLovkildeAndHjemmelName}
        />
      )}
      {isHeaderFooter ? null : (
        <TagList variant="utfallIdList" noneLabel="Alle utfall" ids={utfall} useName={useUtfallNameOrLoading} />
      )}
      {!isHeaderFooter ? null : (
        <TagList variant="enhetIdList" noneLabel="Alle enheter" ids={enheter} useName={useEnhetNameFromIdOrLoading} />
      )}
    </TagContainer>
  );
};

interface TagListProps {
  variant: keyof AppQuery;
  noneLabel: string;
  ids: string[];
  useName: (id: string) => string;
}

const TagList = ({ noneLabel, ...rest }: TagListProps) =>
  rest.ids.length === 0 ? <CustomTag variant={rest.variant}>{noneLabel}</CustomTag> : <ResolvedTags {...rest} />;

const MALTEKST_SECTION_IDS = Object.keys(MALTEKST_SECTION_NAMES);
const isMaltekstSectionName = (sectionId: string): sectionId is keyof typeof MALTEKST_SECTION_NAMES =>
  MALTEKST_SECTION_IDS.includes(sectionId);

const getMaltekstSectionName = (sectionId: string) =>
  isMaltekstSectionName(sectionId) ? MALTEKST_SECTION_NAMES[sectionId] : sectionId;

const getTemaplateAndSectionName = (selected: string): string => {
  const [tId, sId] = selected.split(LIST_DELIMITER);
  const hasSection = sId !== undefined;

  if (tId === GLOBAL) {
    if (!hasSection) {
      return ALL_TEMPLATES_LABEL;
    }

    return `${ALL_TEMPLATES_LABEL} - ${getMaltekstSectionName(sId) ?? sId}`;
  }

  const templateName = tId === undefined ? 'Ukjent mal' : TEMPLATE_MAP[tId]?.tittel ?? tId;

  return sId === undefined ? templateName : `${templateName} - ${getMaltekstSectionName(sId) ?? sId}`;
};

const useYtelseLovkildeAndHjemmelName = (selected: string): string => {
  const { data, isLoading } = useKabalYtelserLatest();
  const [ytelseId, hjemmelId] = selected.split(LIST_DELIMITER);
  const hasHjemmel = hjemmelId !== undefined;

  if (isLoading || data === undefined) {
    return 'Laster...';
  }

  if (ytelseId === GLOBAL) {
    if (!hasHjemmel) {
      return 'Alle ytelser';
    }

    for (const ytelse of data) {
      for (const lovkilde of ytelse.lovKildeToRegistreringshjemler) {
        for (const hjemmel of lovkilde.registreringshjemler) {
          // eslint-disable-next-line max-depth
          if (hjemmel.id === hjemmelId) {
            return `Alle ytelser - ${lovkilde.navn} - ${hjemmel.navn}`;
          }
        }
      }
    }

    return `Alle ytelser - Ukjent lovkilde - Ukjent hjemmel`;
  }

  for (const ytelse of data) {
    if (ytelse.id !== ytelseId) {
      continue;
    }

    if (!hasHjemmel) {
      return ytelse.navn;
    }

    for (const lovkilde of ytelse.lovKildeToRegistreringshjemler) {
      for (const hjemmel of lovkilde.registreringshjemler) {
        if (hjemmel.id === hjemmelId) {
          return `${ytelse.navn} - ${lovkilde.navn} - ${hjemmel.navn}`;
        }
      }
    }

    return `${ytelse.navn} - Ukjent lovkilde - Ukjent hjemmel`;
  }

  return 'Ukjent ytelse';
};

export const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: start;
  gap: 8px;
  flex-grow: 0;
  grid-area: tags;
  max-height: 250px;
  overflow-y: auto;
  flex-shrink: 0;
`;

export const YtelseHjemmelTagList = ({ ytelseHjemmelIdList }: Pick<IText, 'ytelseHjemmelIdList'>) => (
  <TagList
    variant="ytelseHjemmelIdList"
    noneLabel="Alle ytelser og hjemler"
    ids={ytelseHjemmelIdList}
    useName={useYtelseLovkildeAndHjemmelName}
  />
);

export const TemplateSectionTagList = ({ templateSectionIdList }: Pick<IText, 'templateSectionIdList'>) => (
  <TagList
    variant="templateSectionIdList"
    noneLabel="Ingen maler eller seksjoner"
    ids={templateSectionIdList}
    useName={getTemaplateAndSectionName}
  />
);

export const UtfallTagList = ({ utfallIdList }: Pick<IText, 'utfallIdList'>) => (
  <TagList variant="utfallIdList" noneLabel="Alle utfall" ids={utfallIdList} useName={useUtfallNameOrLoading} />
);
