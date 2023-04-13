import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { NoTemplateIdEnum, TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { AppQuery } from '@app/types/texts/texts';
import { HjemlerSelect } from './hjemler-select';
import { useTextQuery } from './hooks/use-text-query';
import { KlageenhetSelect, SectionSelect, TemplateSelect, UtfallSelect, YtelseSelect } from './query-filter-selects';
import { FilterDivider } from './styled-components';

export const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { enheter, hjemler, sections, utfall, ytelser, templates } = useTextQuery();

  const setFilter = (filter: keyof AppQuery, values: string[]) => {
    if (values.length === 0) {
      searchParams.delete(filter);
    } else {
      searchParams.set(filter, values.join(','));
    }

    setSearchParams(searchParams);
  };

  return (
    <Container>
      <TemplateSelect
        selected={templates?.filter((t): t is TemplateIdEnum => t !== NoTemplateIdEnum.NONE) ?? []}
        onChange={(value) => setFilter('templates', value)}
      >
        Maler
      </TemplateSelect>

      <SectionSelect selected={sections ?? []} onChange={(value) => setFilter('sections', value)}>
        Seksjoner
      </SectionSelect>

      <FilterDivider />

      <HjemlerSelect selected={hjemler} onChange={(value: string[]) => setFilter('hjemler', value)} includeNoneOption />

      <YtelseSelect selected={ytelser ?? []} onChange={(value) => setFilter('ytelser', value)}>
        Ytelser
      </YtelseSelect>

      <UtfallSelect selected={utfall ?? []} onChange={(value) => setFilter('utfall', value)}>
        Utfall
      </UtfallSelect>

      <KlageenhetSelect selected={enheter ?? []} onChange={(value) => setFilter('enheter', value)}>
        Enheter
      </KlageenhetSelect>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
