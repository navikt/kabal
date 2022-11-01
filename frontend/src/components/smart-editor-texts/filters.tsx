import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { NoTemplateIdEnum, TemplateIdEnum } from '../../types/smart-editor/template-enums';
import { AppQuery } from '../../types/texts/texts';
import { useTextQuery } from './hooks/use-text-query';
import { KodeverkSelect, SectionSelect, TemplateSelect } from './select';
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

      <KodeverkSelect selected={hjemler ?? []} onChange={(value) => setFilter('hjemler', value)} kodeverkKey="hjemler">
        Hjemler
      </KodeverkSelect>

      <KodeverkSelect selected={ytelser ?? []} onChange={(value) => setFilter('ytelser', value)} kodeverkKey="ytelser">
        Ytelser
      </KodeverkSelect>

      <KodeverkSelect selected={utfall ?? []} onChange={(value) => setFilter('utfall', value)} kodeverkKey="utfall">
        Utfall
      </KodeverkSelect>

      <KodeverkSelect
        selected={enheter ?? []}
        onChange={(value) => setFilter('enheter', value)}
        kodeverkKey="klageenheter"
      >
        Enheter
      </KodeverkSelect>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
