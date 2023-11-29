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
  totalLengthOfMainDocuments: number;
}

export const JournalfoertHeading = memo(
  ({ resetFilters, noFiltersActive, filteredDocuments, allDocuments, totalLengthOfMainDocuments }: Props) => {
    const [isExpanded] = useIsExpanded();
    const numberOfVedlegg = useMemo(
      () => allDocuments.reduce((count, d) => count + d.vedlegg.length, 0),
      [allDocuments],
    );

    const totalCount = totalLengthOfMainDocuments + numberOfVedlegg;

    return (
      <Container $isExpanded={isExpanded}>
        <LeftGroup>
          {isExpanded ? <Menu /> : null}

          <Heading
            size="xsmall"
            level="1"
            title={`Viser ${filteredDocuments.length} filtrerte hoveddokumenter.\n\nAntall hoveddokumenter: ${totalLengthOfMainDocuments}\nAntall vedlegg: ${numberOfVedlegg}\nTotalt: ${totalCount}`}
          >
            Journalførte dokumenter ({filteredDocuments.length}/{totalLengthOfMainDocuments})
          </Heading>
          {isExpanded ? null : <Menu />}
        </LeftGroup>

        <InvisibleWarning
          filteredDocuments={filteredDocuments}
          allDocuments={allDocuments}
          totalLengthWithVedlegg={totalCount}
        />

        <RemoveFilters resetFilters={resetFilters} noFiltersActive={noFiltersActive} />
      </Container>
    );
  },
  (prevProps, nextProps) =>
    prevProps.noFiltersActive === nextProps.noFiltersActive &&
    prevProps.filteredDocuments === nextProps.filteredDocuments &&
    prevProps.totalLengthOfMainDocuments === nextProps.totalLengthOfMainDocuments &&
    prevProps.allDocuments === nextProps.allDocuments,
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

const LeftGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

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
