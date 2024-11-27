import { ALL_TEMPLATES_LABEL } from '@app/components/smart-editor-texts/get-template-options';
import { useMetadataFilters } from '@app/components/smart-editor-texts/hooks/use-metadata-filters';
import { GLOBAL, LIST_DELIMITER, WILDCARD } from '@app/components/smart-editor-texts/types';
import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import { useEnhetNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
import { useUtfallNameOrLoading } from '@app/hooks/use-utfall-name';
import { TEMPLATE_MAP } from '@app/plate/templates/templates';
import { useKabalYtelserLatest } from '@app/simple-api-state/use-kodeverk';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import type { IText } from '@app/types/texts/responses';
import { HStack } from '@navikt/ds-react';
import { CustomTag, ResolvedTags } from '../../tags/resolved-tag';

export const Tags = ({ ytelseHjemmelIdList, utfallIdList, enhetIdList, templateSectionIdList, textType }: IText) => {
  const { hasEnhetFilter, hasTemplateSectionFilter, hasUtfallFilter, hasYtelseHjemmelFilter } =
    useMetadataFilters(textType);

  const expandedYtelseHjemmelIdList = useExpandedYtelseHjemmelIdList(ytelseHjemmelIdList);

  return (
    <TagContainer>
      {hasTemplateSectionFilter ? (
        <TagList
          variant="templateSectionIdList"
          noneLabel="Ingen maler eller seksjoner"
          ids={templateSectionIdList}
          useName={getTemaplateAndSectionName}
        />
      ) : null}
      {hasYtelseHjemmelFilter ? (
        <TagList
          variant="ytelseHjemmelIdList"
          noneLabel="Alle ytelser og hjemler"
          ids={expandedYtelseHjemmelIdList}
          useName={useYtelseLovkildeAndHjemmelName}
        />
      ) : null}
      {hasUtfallFilter ? (
        <TagList variant="utfallIdList" noneLabel="Alle utfall" ids={utfallIdList} useName={useUtfallNameOrLoading} />
      ) : null}
      {hasEnhetFilter ? (
        <TagList
          variant="enhetIdList"
          noneLabel="Alle enheter"
          ids={enhetIdList}
          useName={useEnhetNameFromIdOrLoading}
        />
      ) : null}
    </TagContainer>
  );
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
const useExpandedYtelseHjemmelIdList = (selectedList: string[]): string[] => {
  const { data: ytelser = [] } = useKabalYtelserLatest();
  const result: string[] = [];

  for (const selected of selectedList) {
    if (selected === GLOBAL) {
      for (const { id } of ytelser) {
        result.push(id);
      }
      continue;
    }

    const [ytelseId, hjemmelId] = selected.split(LIST_DELIMITER);

    if (hjemmelId === undefined) {
      result.push(selected);
    } else if (ytelseId === GLOBAL) {
      for (const { id, lovKildeToRegistreringshjemler } of ytelser) {
        for (const { registreringshjemler } of lovKildeToRegistreringshjemler) {
          for (const hjemmel of registreringshjemler) {
            if (hjemmel.id === hjemmelId) {
              result.push(`${id}${LIST_DELIMITER}${hjemmelId}`);
            }
          }
        }
      }
    } else {
      result.push(selected);
    }
  }

  return result;
};

interface TagListProps {
  variant: keyof IGetMaltekstseksjonParams;
  noneLabel: string;
  ids: string[];
  useName: (id: string) => string;
}

const TagList = ({ noneLabel, ...rest }: TagListProps) =>
  rest.ids.length === 0 ? <CustomTag variant={rest.variant}>{noneLabel}</CustomTag> : <ResolvedTags {...rest} />;

const MALTEKST_SECTION_IDS = Object.keys(MALTEKST_SECTION_NAMES);
const isMaltekstSectionName = (sectionId: string): sectionId is keyof typeof MALTEKST_SECTION_NAMES =>
  MALTEKST_SECTION_IDS.includes(sectionId);

const getMaltekstSectionName = (sectionId: string) => {
  if (isMaltekstSectionName(sectionId)) {
    return MALTEKST_SECTION_NAMES[sectionId];
  }

  if (sectionId === WILDCARD) {
    return 'Alle seksjoner';
  }

  return sectionId;
};

const getTemaplateAndSectionName = (selected: string): string => {
  const [tId, sId] = selected.split(LIST_DELIMITER);
  const hasSection = sId !== undefined;

  if (tId === GLOBAL) {
    if (!hasSection) {
      return ALL_TEMPLATES_LABEL;
    }

    return `${ALL_TEMPLATES_LABEL} - ${getMaltekstSectionName(sId) ?? sId}`;
  }

  const templateName = tId === undefined ? 'Ukjent mal' : (TEMPLATE_MAP[tId]?.tittel ?? tId);

  return sId === undefined ? templateName : `${templateName} - ${getMaltekstSectionName(sId) ?? sId}`;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
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
          if (hjemmel.id === hjemmelId) {
            return `Alle ytelser - ${lovkilde.navn} - ${hjemmel.navn}`;
          }
        }
      }
    }

    return 'Alle ytelser - Ukjent lovkilde - Ukjent hjemmel';
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

export const TagContainer = (props: { children: React.ReactNode }) => (
  <HStack
    data-element="tag-container"
    gap="2"
    wrap
    align="center"
    flexGrow="0"
    gridColumn="tags"
    maxHeight="250px"
    overflowY="auto"
    flexShrink="0"
    {...props}
  />
);

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
