import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import React, { memo } from 'react';
import { styled } from 'styled-components';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { InvisibleWarning, InvisibleWarningProps } from './invisible-warning';
import { Menu } from './menu';

interface RemoveFiltersProps {
  resetFilters: () => void;
  noFiltersActive: boolean;
}

interface Props extends RemoveFiltersProps, Pick<InvisibleWarningProps, 'slicedFilteredDocumentIds'> {
  filteredLength: number;
  journalpostCount: number;
  vedleggCount: number;
}

export const JournalfoertHeading = memo(
  ({
    resetFilters,
    noFiltersActive,
    filteredLength,
    slicedFilteredDocumentIds,
    journalpostCount,
    vedleggCount,
  }: Props) => {
    const [isExpanded] = useIsExpanded();
    const totalCount = journalpostCount + vedleggCount;

    return (
      <Container $isExpanded={isExpanded}>
        <Heading
          size="xsmall"
          level="1"
          title={`Viser ${slicedFilteredDocumentIds.length} av ${filteredLength} filtrerte hoveddokumenter.\n\nAntall hoveddokumenter: ${journalpostCount}\nAntall vedlegg: ${vedleggCount}\nTotalt: ${totalCount}`}
        >
          Journalførte dokumenter ({slicedFilteredDocumentIds.length}/{filteredLength})
        </Heading>
        <InvisibleWarning slicedFilteredDocumentIds={slicedFilteredDocumentIds} totalCountWithVedlegg={totalCount} />
        <Buttons $isExpanded={isExpanded}>
          <RemoveFilters resetFilters={resetFilters} noFiltersActive={noFiltersActive} />
          <Menu />
        </Buttons>
      </Container>
    );
  },
  (prevProps, nextProps) =>
    prevProps.noFiltersActive === nextProps.noFiltersActive &&
    prevProps.slicedFilteredDocumentIds === nextProps.slicedFilteredDocumentIds &&
    prevProps.filteredLength === nextProps.filteredLength &&
    prevProps.journalpostCount === nextProps.journalpostCount,
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
