import { HStack } from '@navikt/ds-react';
import { useSearchParams } from 'react-router-dom';
import { YtelserAndHjemlerSelect } from '@/components/smart-editor-texts/hjemler-select/ytelser-and-hjemler-select';
import { useMetadataFilters } from '@/components/smart-editor-texts/hooks/use-metadata-filters';
import { useUtfallOptions } from '@/components/smart-editor-texts/hooks/use-options';
import { useTextQuery } from '@/components/smart-editor-texts/hooks/use-text-query';
import {
  KlageenhetSelect,
  TemplateSectionSelect,
  UtfallSelect,
} from '@/components/smart-editor-texts/query-filter-selects';
import type { IGetMaltekstseksjonParams, TextTypes } from '@/types/common-text-types';

interface Props {
  textType: TextTypes;
  className?: string;
}

export const Filters = ({ textType, className }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasTemplateSectionFilter, hasEnhetFilter, hasUtfallFilter, hasYtelseHjemmelFilter } =
    useMetadataFilters(textType);
  const hasAnyFilter = hasTemplateSectionFilter || hasEnhetFilter || hasUtfallFilter || hasYtelseHjemmelFilter;

  const { enhetIdList, utfallIdList, templateSectionIdList, ytelseHjemmelIdList } = useTextQuery();

  const utfallOptions = useUtfallOptions();

  if (!hasAnyFilter) {
    return null;
  }

  const setFilter = (filter: keyof IGetMaltekstseksjonParams, values: string[]) => {
    if (values.length === 0) {
      searchParams.delete(filter);
    } else {
      searchParams.set(filter, values.join(','));
    }

    setSearchParams(searchParams);
  };

  return (
    <HStack className={className} gap="space-8">
      {hasTemplateSectionFilter ? (
        <TemplateSectionSelect
          selected={templateSectionIdList ?? []}
          onChange={(value) => setFilter('templateSectionIdList', value)}
          includeNoneOption
          includeDeprecated
        />
      ) : null}

      {hasYtelseHjemmelFilter ? (
        <YtelserAndHjemlerSelect
          selected={ytelseHjemmelIdList ?? []}
          onChange={(value: string[]) => setFilter('ytelseHjemmelIdList', value)}
          includeNoneOption
          ytelseIsWildcard
        />
      ) : null}

      {hasUtfallFilter ? (
        <UtfallSelect
          selected={utfallIdList}
          onChange={(value) => setFilter('utfallIdList', value)}
          options={utfallOptions}
        >
          Utfallsett
        </UtfallSelect>
      ) : null}

      {hasEnhetFilter ? (
        <KlageenhetSelect
          selected={enhetIdList ?? []}
          onChange={(value) => setFilter('enhetIdList', value)}
          includeNoneOption
        >
          Enheter
        </KlageenhetSelect>
      ) : null}
    </HStack>
  );
};
