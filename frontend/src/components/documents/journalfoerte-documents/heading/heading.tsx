import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, Stack } from '@navikt/ds-react';
import { memo, useMemo } from 'react';
import { InvisibleWarning, type InvisibleWarningProps } from './invisible-warning';
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
      <Stack
        direction={isExpanded ? 'row' : 'column'}
        align={isExpanded ? 'center' : 'start'}
        justify="space-between"
        paddingBlock="0 1"
        gap="2 4"
        flexShrink="0"
      >
        <HStack align="center" gap="2">
          {isExpanded ? <Menu /> : null}

          <Heading
            size="xsmall"
            level="1"
            title={`Viser ${filteredDocuments.length} filtrerte hoveddokumenter.\n\nAntall hoveddokumenter: ${totalLengthOfMainDocuments}\nAntall vedlegg: ${numberOfVedlegg}\nTotalt: ${totalCount}`}
          >
            Journalførte dokumenter ({filteredDocuments.length}/{totalLengthOfMainDocuments})
          </Heading>
          {isExpanded ? null : <Menu />}
        </HStack>

        <InvisibleWarning
          filteredDocuments={filteredDocuments}
          allDocuments={allDocuments}
          totalLengthWithVedlegg={totalCount}
        />

        <RemoveFilters resetFilters={resetFilters} noFiltersActive={noFiltersActive} />
      </Stack>
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
