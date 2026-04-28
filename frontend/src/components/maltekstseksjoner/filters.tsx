import { HStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { getTemplateOptions } from '@/components/smart-editor-texts/get-template-options';
import { YtelserAndHjemlerSelect } from '@/components/smart-editor-texts/hjemler-select/ytelser-and-hjemler-select';
import { SectionSelect } from '@/components/smart-editor-texts/query-filter-selects';
import { GLOBAL, LIST_DELIMITER, NONE } from '@/components/smart-editor-texts/types';
import { UtfallSetFilter } from '@/components/smart-editor-texts/utfall-set-filter/utfall-set-filter';
import {
  useUpdateTemplateSectionIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
} from '@/redux-api/maltekstseksjoner/mutations';
import type { IGetMaltekstseksjonParams } from '@/types/common-text-types';
import type { IMaltekstseksjon } from '@/types/maltekstseksjoner/responses';

interface Props {
  maltekst: IMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
}

export const Filters = ({ maltekst, query }: Props) => {
  const [updateTemplateSection] = useUpdateTemplateSectionIdListMutation({
    fixedCacheKey: `${maltekst.id}-templatesections`,
  });
  const [updateYtelseHjemmel] = useUpdateYtelseHjemmelIdListMutation({
    fixedCacheKey: `${maltekst.id}-ytelsehjemmel`,
  });
  const [updateUtfall] = useUpdateUtfallIdListMutation({
    fixedCacheKey: `${maltekst.id}-utfall`,
  });

  const nestedOptions = useMemo(
    () => getTemplateOptions(maltekst.templateSectionIdList, false, true, false, GLOBAL),
    [maltekst.templateSectionIdList],
  );

  const { sectionsCount } = useCounts(maltekst.templateSectionIdList);

  return (
    <HStack gap="space-8" className="[grid-area:filters]">
      <SectionSelect
        selected={maltekst.templateSectionIdList}
        onChange={(templateSectionIdList) => updateTemplateSection({ id: maltekst.id, templateSectionIdList, query })}
        nestedOptions={nestedOptions}
        sectionsCount={sectionsCount}
      />
      <YtelserAndHjemlerSelect
        selected={maltekst.ytelseHjemmelIdList}
        onChange={(ytelseHjemmelIdList) => updateYtelseHjemmel({ id: maltekst.id, ytelseHjemmelIdList, query })}
      />
      <UtfallSetFilter
        selected={maltekst.utfallIdList}
        onChange={(utfallIdList) => updateUtfall({ id: maltekst.id, utfallIdList, query })}
      />
    </HStack>
  );
};

const useCounts = (selected: string[]) =>
  useMemo(() => {
    let sectionsCount = 0;

    for (const item of selected) {
      if (item === NONE) {
        continue;
      }

      if (item.includes(LIST_DELIMITER)) {
        sectionsCount++;
      }
    }

    return { sectionsCount };
  }, [selected]);
