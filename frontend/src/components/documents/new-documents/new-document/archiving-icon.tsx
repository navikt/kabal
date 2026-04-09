import { HourglassIcon } from '@navikt/aksel-icons';
import { HStack } from '@navikt/ds-react';
import { memo } from 'react';
import { Fields } from '@/components/documents/new-documents/grid';
import { DistribusjonsType } from '@/types/documents/documents';

export const ArchivingIcon = memo(
  ({ dokumentTypeId }: { dokumentTypeId: DistribusjonsType }) => (
    <HStack
      as="span"
      width="8"
      height="8"
      align="center"
      justify="center"
      style={{ gridArea: Fields.Action }}
      title={
        dokumentTypeId === DistribusjonsType.NOTAT
          ? 'Dokumentet er under journalføring.'
          : 'Dokumentet er under journalføring og utsending.'
      }
    >
      <HourglassIcon aria-hidden />
    </HStack>
  ),
  (p, n) => p.dokumentTypeId === n.dokumentTypeId,
);

ArchivingIcon.displayName = 'ArchivingIcon';
