import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { InvisibleWarning, InvisibleWarningProps } from './invisible-warning';
import { Menu } from './menu';

interface RemoveFiltersProps {
  resetFilters: () => void;
  noFiltersActive: boolean;
}

interface Props extends RemoveFiltersProps, Omit<InvisibleWarningProps, 'totalLengthWithVedlegg'> {
  filteredLength: number;
  totalLengthOfMainDocuments: number | undefined;
}

export const Header = memo(
  ({
    resetFilters,
    noFiltersActive,
    filteredLength,
    slicedFilteredDocuments,
    allDocuments,
    totalLengthOfMainDocuments = 0,
  }: Props) => {
    const numberOfVedlegg = useMemo(
      () => allDocuments.reduce((count, d) => count + d.vedlegg.length, 0),
      [allDocuments]
    );

    const totalCount = totalLengthOfMainDocuments + numberOfVedlegg;

    return (
      <Container>
        <Heading
          size="small"
          level="1"
          title={`Viser ${slicedFilteredDocuments.length} av ${filteredLength} filtrerte hoveddokumenter.\n\nAntall hoveddokumenter: ${totalLengthOfMainDocuments}\nAntall vedlegg: ${numberOfVedlegg}\nTotalt: ${totalCount}`}
        >
          Journalførte dokumenter ({slicedFilteredDocuments.length}/{totalLengthOfMainDocuments})
        </Heading>
        <InvisibleWarning
          slicedFilteredDocuments={slicedFilteredDocuments}
          allDocuments={allDocuments}
          totalLengthWithVedlegg={totalCount}
        />
        <Buttons>
          <RemoveFilters resetFilters={resetFilters} noFiltersActive={noFiltersActive} />
          <Menu />
        </Buttons>
      </Container>
    );
  },
  (prevProps, nextProps) =>
    prevProps.noFiltersActive === nextProps.noFiltersActive &&
    prevProps.slicedFilteredDocuments === nextProps.slicedFilteredDocuments &&
    prevProps.filteredLength === nextProps.filteredLength &&
    prevProps.totalLengthOfMainDocuments === nextProps.totalLengthOfMainDocuments
);

Header.displayName = 'Header';

const RemoveFilters = ({ resetFilters, noFiltersActive }: RemoveFiltersProps) => {
  if (noFiltersActive) {
    return null;
  }

  return (
    <Button size="small" variant="secondary" onClick={resetFilters} icon={<ArrowCirclepathIcon aria-hidden />}>
      Fjern filtere
    </Button>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 48px;
  align-items: center;
  column-gap: 16px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;
