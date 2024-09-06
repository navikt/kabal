import { styled } from 'styled-components';
import { HjemlerSelect } from '@app/components/smart-editor-texts/hjemler-select/hjemler-select';
import { TemplateSectionSelect } from '@app/components/smart-editor-texts/query-filter-selects';
import { UtfallSetFilter } from '@app/components/smart-editor-texts/utfall-set-filter/utfall-set-filter';
import {
  useUpdateTemplateSectionIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
} from '@app/redux-api/maltekstseksjoner/mutations';
import { IGetMaltekstseksjonParams, MALTEKSTSEKSJON_TYPE } from '@app/types/common-text-types';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';

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
    <Container>
      <TemplateSectionSelect
        textType={MALTEKSTSEKSJON_TYPE}
        selected={maltekst.templateSectionIdList}
        onChange={(templateSectionIdList) => updateTemplateSection({ id: maltekst.id, templateSectionIdList, query })}
      >
        Maler og seksjoner
      </TemplateSectionSelect>

      <HjemlerSelect
        selected={maltekst.ytelseHjemmelIdList}
        onChange={(ytelseHjemmelIdList) => updateYtelseHjemmel({ id: maltekst.id, ytelseHjemmelIdList, query })}
      />

      <UtfallSetFilter
        selected={maltekst.utfallIdList}
        onChange={(utfallIdList) => updateUtfall({ id: maltekst.id, utfallIdList, query })}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: var(--a-spacing-2);
  grid-area: filters;
`;
