import React from 'react';
import { styled } from 'styled-components';
import { HjemlerSelect } from '@app/components/smart-editor-texts/hjemler-select';
import { TemplateSectionSelect } from '@app/components/smart-editor-texts/query-filter-selects';
import { UtfallSetFilter } from '@app/components/smart-editor-texts/utfall-set-filter/utfall-set-filter';
import {
  useUpdateTemplateSectionIdListMutation,
  useUpdateUtfallIdListMutation,
  useUpdateYtelseHjemmelIdListMutation,
} from '@app/redux-api/maltekstseksjoner/mutations';
import { RichTextTypes } from '@app/types/common-text-types';
import { IGetTextsParams } from '@app/types/maltekstseksjoner/params';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';

interface Props {
  maltekst: IMaltekstseksjon;
  query: IGetTextsParams;
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
        textType={RichTextTypes.MALTEKSTSEKSJON}
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
  gap: 8px;
  grid-area: filters;
`;
