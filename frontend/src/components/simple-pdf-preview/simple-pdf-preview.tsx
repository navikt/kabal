import { Pdf } from '@app/components/pdf/pdf';
import type { UsePdfData } from '@app/components/pdf/use-pdf-data';
import { Header } from '@app/components/view-pdf/header';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Box, Button, VStack } from '@navikt/ds-react';

export const SimplePdfPreview = ({ refresh, loading, data, error }: UsePdfData) => (
  <VStack asChild height="100%" flexGrow="1" width="min-content">
    <Box shadow="dialog">
      <Header>
        <Button
          onClick={refresh}
          title="Oppdater PDF"
          icon={<ArrowCirclepathIcon aria-hidden />}
          loading={loading}
          size="xsmall"
          variant="tertiary-neutral"
        />
      </Header>

      <Pdf loading={loading} data={data} error={error} refresh={refresh} />
    </Box>
  </VStack>
);
