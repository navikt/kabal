import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import React, { memo, useMemo } from 'react';
import { styled } from 'styled-components';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
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

export const JournalfoertHeading = memo(
  ({
    resetFilters,
    noFiltersActive,
    filteredLength,
    slicedFilteredDocuments,
    allDocuments,
    totalLengthOfMainDocuments = 0,
  }: Props) => {
    const [isExpanded] = useIsExpanded();
    const numberOfVedlegg = useMemo(
      () => allDocuments.reduce((count, d) => count + d.vedlegg.length, 0),
      [allDocuments],
    );

    const totalCount = totalLengthOfMainDocuments + numberOfVedlegg;

    return (
      <Container $isExpanded={isExpanded}>
        <Heading
          size="xsmall"
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
        <Buttons $isExpanded={isExpanded}>
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
    prevProps.totalLengthOfMainDocuments === nextProps.totalLengthOfMainDocuments,
);

JournalfoertHeading.displayName = 'Header';

const RemoveFilters = ({ resetFilters, noFiltersActive }: RemoveFiltersProps) => {
  if (noFiltersActive) {
    return null;
  }

  return (
    <Button size="small" variant="secondary" onClick={resetFilters} icon={<ArrowCirclepathIcon aria-hidden />}>
      Nullstill filtere
    </Button>
  );
};

const Container = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  flex-direction: ${({ $isExpanded }) => ($isExpanded ? 'row' : 'column')};
  align-items: ${({ $isExpanded }) => ($isExpanded ? 'center' : 'flex-start')};
  justify-content: space-between;
  min-height: 50px;
  padding-bottom: 8px;
  column-gap: 16px;
  row-gap: 8px;
  flex-shrink: 0;
`;

const Buttons = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  width: ${({ $isExpanded }) => ($isExpanded ? 'auto' : '100%')};
  justify-content: flex-start;
  min-height: 34px;
`;
