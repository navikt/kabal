import { useMetadataFilters } from '@app/components/smart-editor-texts/hooks/use-metadata-filters';
import { useUtfallOptions } from '@app/components/smart-editor-texts/hooks/use-options';
import {
  KlageenhetSelect,
  TemplateSectionSelect,
  UtfallSelect,
} from '@app/components/smart-editor-texts/query-filter-selects';
import type { IGetMaltekstseksjonParams, TextTypes } from '@app/types/common-text-types';
import { useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { HjemlerSelect } from './hjemler-select/hjemler-select';
import { useTextQuery } from './hooks/use-text-query';

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
    <Container className={className}>
      {hasTemplateSectionFilter ? (
        <TemplateSectionSelect
          selected={templateSectionIdList ?? []}
          onChange={(value) => setFilter('templateSectionIdList', value)}
          includeNoneOption
          templatesSelectable
        >
          Maler og seksjoner
        </TemplateSectionSelect>
      ) : null}

      {hasYtelseHjemmelFilter ? (
        <HjemlerSelect
          selected={ytelseHjemmelIdList ?? []}
          onChange={(value: string[]) => setFilter('ytelseHjemmelIdList', value)}
          includeNoneOption
          ytelserSelectable
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--a-spacing-2);
`;
