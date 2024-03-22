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
import { AppQuery, PlainTextTypes, RichTextTypes, TextTypes } from '@app/types/common-text-types';
import { HjemlerSelect } from './hjemler-select/hjemler-select';
import { useTextQuery } from './hooks/use-text-query';

interface Props {
  textType: TextTypes;
  className?: string;
}

export const Filters = ({ textType, className }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { enhetIdList, utfallIdList, templateSectionIdList, ytelseHjemmelIdList } = useTextQuery();

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
    <Container className={className}>
      {hasFixedLocation ? null : (
        <TemplateSectionSelect
          selected={templateSectionIdList ?? []}
          onChange={(value) => setFilter('templateSectionIdList', value)}
          textType={textType}
          includeNoneOption
          templatesSelectable
        >
          Maler og seksjoner
        </TemplateSectionSelect>
      )}

      {isHeaderFooter ? null : (
        <HjemlerSelect
          selected={ytelseHjemmelIdList ?? []}
          onChange={(value: string[]) => setFilter('ytelseHjemmelIdList', value)}
          includeNoneOption
          ytelserSelectable
          ytelseIsWildcard
        />
      )}

      {isHeaderFooter ? null : (
        <UtfallSelect
          selected={utfallIdList}
          onChange={(value) => setFilter('utfallIdList', value)}
          options={utfallOptions}
        >
          Utfallsett
        </UtfallSelect>
      )}

      {isHeaderFooter ? (
        <KlageenhetSelect
          selected={enhetIdList ?? []}
          onChange={(value) => setFilter('enhetIdList', value)}
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
