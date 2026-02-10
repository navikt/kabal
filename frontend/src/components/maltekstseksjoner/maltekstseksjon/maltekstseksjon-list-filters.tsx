import { YtelserAndHjemlerSelect } from '@app/components/smart-editor-texts/hjemler-select/ytelser-and-hjemler-select';
import { useUtfallOptions } from '@app/components/smart-editor-texts/hooks/use-options';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { TemplateSectionSelect, UtfallSelect } from '@app/components/smart-editor-texts/query-filter-selects';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import { HStack } from '@navikt/ds-react';
import { useSearchParams } from 'react-router-dom';

export const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { utfallIdList, templateSectionIdList, ytelseHjemmelIdList } = useTextQuery();

  const utfallOptions = useUtfallOptions();

  const setFilter = (filter: keyof IGetMaltekstseksjonParams, values: string[]) => {
    if (values.length === 0) {
      searchParams.delete(filter);
    } else {
      searchParams.set(filter, values.join(','));
    }

    setSearchParams(searchParams);
  };

  return (
    <HStack gap="space-0 space-8" className="[grid-area:filters]">
      <TemplateSectionSelect
        selected={templateSectionIdList ?? []}
        onChange={(value) => setFilter('templateSectionIdList', value)}
        includeNoneOption
        includeDeprecated
      />

      <YtelserAndHjemlerSelect
        selected={ytelseHjemmelIdList ?? []}
        onChange={(value: string[]) => setFilter('ytelseHjemmelIdList', value)}
        includeNoneOption
        ytelseIsWildcard
      />

      <UtfallSelect
        selected={utfallIdList}
        onChange={(value) => setFilter('utfallIdList', value)}
        options={utfallOptions}
      >
        Utfallsett
      </UtfallSelect>
    </HStack>
  );
};
