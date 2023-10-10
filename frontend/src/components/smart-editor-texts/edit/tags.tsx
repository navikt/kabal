import React from 'react';
import { styled } from 'styled-components';
import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import { ALL_TEMPLATES_LABEL } from '@app/components/smart-editor-texts/query-filter-selects';
import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import { useEnhetNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
import { useUtfallNameOrLoading } from '@app/hooks/use-utfall-name';
import { TEMPLATES } from '@app/plate/templates/templates';
import { useKabalYtelserLatest } from '@app/simple-api-state/use-kodeverk';
import { AppQuery, IText, PlainTextTypes, RichTextTypes } from '@app/types/texts/texts';
import { CustomTag, ResolvedTags } from '../../tags/resolved-tag';

export const Tags = ({ ytelseHjemmelList, utfall, enheter, templateSectionList, textType }: IText) => {
  const isHeaderFooter = textType === PlainTextTypes.HEADER || textType === PlainTextTypes.FOOTER;
  const hasFixedLocation = isHeaderFooter || textType === RichTextTypes.REGELVERK;

  return (
    <TagContainer>
      {isHeaderFooter || hasFixedLocation ? null : (
        <TagList
          variant="templateSectionList"
          noneLabel="Ingen maler eller seksjoner"
          ids={templateSectionList}
          useName={getTemaplateAndSectionName}
        />
      )}
      {isHeaderFooter ? null : (
        <TagList
          variant="ytelseHjemmelList"
          noneLabel="Alle ytelser og hjemler"
          ids={ytelseHjemmelList}
          useName={useYtelseLovkildeAndHjemmelName}
        />
      )}
      {isHeaderFooter ? null : (
        <TagList variant="utfall" noneLabel="Alle utfall" ids={utfall} useName={useUtfallNameOrLoading} />
      )}
      {!isHeaderFooter ? null : (
        <TagList variant="enheter" noneLabel="Alle enheter" ids={enheter} useName={useEnhetNameFromIdOrLoading} />
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

  const templateName = tId === undefined ? 'Ukjent mal' : TEMPLATES.find((t) => t.templateId === tId)?.tittel ?? tId;

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

const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: start;
  gap: 8px;
  flex-grow: 0;
`;
