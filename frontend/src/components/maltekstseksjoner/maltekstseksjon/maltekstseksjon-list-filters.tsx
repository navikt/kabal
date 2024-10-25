import { HjemlerSelect } from '@app/components/smart-editor-texts/hjemler-select/hjemler-select';
import { useUtfallOptions } from '@app/components/smart-editor-texts/hooks/use-options';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { TemplateSectionSelect, UtfallSelect } from '@app/components/smart-editor-texts/query-filter-selects';
import { StatusFilter } from '@app/components/smart-editor-texts/status-filter/status-filter';
import { type IGetMaltekstseksjonParams, MALTEKSTSEKSJON_TYPE } from '@app/types/common-text-types';
import { useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';

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
    <Container>
      <TemplateSectionSelect
        selected={templateSectionIdList ?? []}
        onChange={(value) => setFilter('templateSectionIdList', value)}
        textType={MALTEKSTSEKSJON_TYPE}
        includeNoneOption
        templatesSelectable
      >
        Maler og seksjoner
      </TemplateSectionSelect>

      <HjemlerSelect
        selected={ytelseHjemmelIdList ?? []}
        onChange={(value: string[]) => setFilter('ytelseHjemmelIdList', value)}
        includeNoneOption
        ytelserSelectable
        ytelseIsWildcard
      />

      <UtfallSelect
        selected={utfallIdList}
        onChange={(value) => setFilter('utfallIdList', value)}
        options={utfallOptions}
      >
        Utfallsett
      </UtfallSelect>

      <StatusFilter />
    </Container>
  );
};

const Container = styled.div`
  grid-area: filters;
  display: flex;
  flex-direction: row;
  column-gap: var(--a-spacing-2);
  padding: var(--a-spacing-1);
  padding-top: 0;
`;
