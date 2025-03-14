import { Fields, GRID_CLASSES } from '@app/components/documents/new-documents/grid';
import { DistribusjonsType } from '@app/types/documents/documents';
import { HourglassIcon } from '@navikt/aksel-icons';
import { HStack } from '@navikt/ds-react';
import { memo } from 'react';

export const ArchivingIcon = memo(
  ({ dokumentTypeId }: { dokumentTypeId: DistribusjonsType }) => (
    <HStack
      as="span"
      width="8"
      height="8"
      align="center"
      justify="center"
      className={GRID_CLASSES[Fields.Action]}
      title={
        dokumentTypeId === DistribusjonsType.NOTAT
          ? 'Dokumentet er under journalføring.'
          : 'Dokumentet er under journalføring og utsending.'
      }
      data-testid="document-archiving"
    >
      <HourglassIcon aria-hidden />
    </HStack>
  ),
  (p, n) => p.dokumentTypeId === n.dokumentTypeId,
);

ArchivingIcon.displayName = 'ArchivingIcon';
