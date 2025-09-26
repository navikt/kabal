import { HjemlerSelect } from '@app/components/smart-editor-texts/hjemler-select/hjemler-select';
import { TemplateSectionSelect } from '@app/components/smart-editor-texts/query-filter-selects';
import { UtfallSetFilter } from '@app/components/smart-editor-texts/utfall-set-filter/utfall-set-filter';
import {
  useUpdateTemplateSectionIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
} from '@app/redux-api/maltekstseksjoner/mutations';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { HStack } from '@navikt/ds-react';

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

  return (
    <HStack gap="2" className="[grid-area:filters]">
      <TemplateSectionSelect
        selected={maltekst.templateSectionIdList}
        onChange={(templateSectionIdList) => updateTemplateSection({ id: maltekst.id, templateSectionIdList, query })}
        includeDeprecated
      >
        Maler og seksjoner
      </TemplateSectionSelect>
      <HjemlerSelect
        selected={maltekst.ytelseHjemmelIdList}
        onChange={(ytelseHjemmelIdList) => updateYtelseHjemmel({ id: maltekst.id, ytelseHjemmelIdList, query })}
        ytelserSelectable
      />
      <UtfallSetFilter
        selected={maltekst.utfallIdList}
        onChange={(utfallIdList) => updateUtfall({ id: maltekst.id, utfallIdList, query })}
      />
    </HStack>
  );
};
