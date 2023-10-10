import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { useKlageenheterOptions, useUtfallOptions } from '@app/components/smart-editor-texts/hooks/use-options';
import {
  KlageenhetSelect,
  TemplateSectionSelect,
  UtfallSelect,
} from '@app/components/smart-editor-texts/query-filter-selects';
import { NONE_OPTION } from '@app/components/smart-editor-texts/types';
import { AppQuery, PlainTextTypes, RichTextTypes, TextTypes } from '@app/types/texts/texts';
import { HjemlerSelect } from './hjemler-select';
import { useTextQuery } from './hooks/use-text-query';

interface Props {
  textType: TextTypes;
}

export const Filters = ({ textType }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { enheter, utfall, templateSectionList, ytelseHjemmelList } = useTextQuery();

  const utfallOptions = useUtfallOptions();
  const klageenheterOptions = useKlageenheterOptions();

  const setFilter = (filter: keyof AppQuery, values: string[]) => {
    if (values.length === 0) {
      searchParams.delete(filter);
    } else {
      searchParams.set(filter, values.join(','));
    }

    setSearchParams(searchParams);
  };

  const isHeaderFooter = textType === PlainTextTypes.HEADER || textType === PlainTextTypes.FOOTER;
  const hasFixedLocation = isHeaderFooter || textType === RichTextTypes.REGELVERK;

  return (
    <Container>
      {hasFixedLocation ? null : (
        <TemplateSectionSelect
          selected={templateSectionList ?? []}
          onChange={(value) => setFilter('templateSectionList', value)}
          textType={textType}
          includeNoneOption
          templatesSelectable
        >
          Maler og seksjoner
        </TemplateSectionSelect>
      )}

      {isHeaderFooter ? null : (
        <HjemlerSelect
          selected={ytelseHjemmelList ?? []}
          onChange={(value: string[]) => setFilter('ytelseHjemmelList', value)}
          includeNoneOption
        />
      )}

      {isHeaderFooter ? null : (
        <UtfallSelect selected={utfall} onChange={(value) => setFilter('utfall', value)} options={utfallOptions}>
          Utfallsett
        </UtfallSelect>
      )}

      {isHeaderFooter ? (
        <KlageenhetSelect
          selected={enheter ?? []}
          onChange={(value) => setFilter('enheter', value)}
          options={[NONE_OPTION, ...klageenheterOptions]}
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
  gap: 8px;
`;
