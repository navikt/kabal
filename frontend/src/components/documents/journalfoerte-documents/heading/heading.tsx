import { KeyboardHelpButton } from '@app/components/documents/journalfoerte-documents/header/keyboard-help-button';
import { unselectAll } from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack, Stack, Tooltip } from '@navikt/ds-react';
import { memo, useMemo } from 'react';
import { Menu } from './menu';

interface RemoveFiltersProps {
  resetFilters: () => void;
  noFiltersActive: boolean;
}

interface Props extends RemoveFiltersProps {
  totalLengthOfMainDocuments: number;
  allDocuments: IArkivertDocument[];
  filteredDocuments: IArkivertDocument[];
}

const JOURNALFOERTE_DOCUMENTS_HEADING_ID = 'journalfoerte-dokumenter-heading';

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
        paddingBlock="1"
        paddingInline="1 2"
        gap="2"
        flexShrink="0"
      >
        <HStack align="center" gap="2">
          {isExpanded ? <Menu /> : null}

          <Tooltip
            className="whitespace-pre"
            maxChar={Number.POSITIVE_INFINITY}
            content={`Viser ${filteredDocuments.length} filtrerte hoveddokumenter.\n\nAntall hoveddokumenter: ${totalLengthOfMainDocuments}\nAntall vedlegg: ${numberOfVedlegg}\nTotalt: ${totalCount}`}
            describesChild
          >
            <Heading size="xsmall" level="1" id={JOURNALFOERTE_DOCUMENTS_HEADING_ID}>
              Journalførte dokumenter ({filteredDocuments.length}/{totalLengthOfMainDocuments})
            </Heading>
          </Tooltip>
          {isExpanded ? null : <Menu />}
        </HStack>

        <KeyboardHelpButton />

        <Button onClick={() => unselectAll()} variant="secondary-neutral" size="small">
          Nullstill valg
        </Button>

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
    <Button size="small" variant="secondary-neutral" onClick={resetFilters} icon={<ArrowCirclepathIcon aria-hidden />}>
      Nullstill filtre
    </Button>
  );
};
