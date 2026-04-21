import { CircleSlashIcon } from '@navikt/aksel-icons';
import { Tooltip, VStack } from '@navikt/ds-react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';

export const MottattCheckbox = () => (
  <VStack style={{ gridArea: Fields.Select }} justify="center">
    <Tooltip content="Journalposten har status mottatt. Fullfør journalføring i Gosys for å kunne huke det av.">
      <CircleSlashIcon aria-hidden fontSize={20} className="opacity-30" />
    </Tooltip>
  </VStack>
);
