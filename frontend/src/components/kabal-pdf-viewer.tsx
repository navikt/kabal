import { useAppTheme } from '@app/app-theme';
import { toast } from '@app/components/toast/store';
import { Section } from '@app/components/toast/toast-content/api-error-toast';
import { ENVIRONMENT } from '@app/environment';
import { parseJSON } from '@app/functions/parse-json';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { isKabalApiErrorData, type KabalApiErrorData } from '@app/types/errors';
import { BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { type FetchErrorInfo, KlageFileViewer, type KlageFileViewerProps } from '@navikt/klage-file-viewer';
// @ts-expect-error — Vite `?url` import: returns the resolved public URL as a string.
import EXCEL_WORKER_SRC from '@navikt/klage-file-viewer/excel-worker?url';
// @ts-expect-error — Vite `?url` import: returns the resolved public URL as a string.
import WORKER_SRC from '@navikt/klage-file-viewer/pdf-worker?url';
import { useState } from 'react';

export type { FileEntry, KlageFileViewerProps } from '@navikt/klage-file-viewer';

export const KabalPdfViewer = ({
  files,
  onClose,
  newTab,
}: Pick<KlageFileViewerProps, 'files' | 'onClose' | 'newTab'>) => {
  const appTheme = useAppTheme();

  return (
    <KlageFileViewer
      files={files}
      onClose={onClose}
      newTab={newTab}
      workerSrc={WORKER_SRC}
      excelWorkerSrc={EXCEL_WORKER_SRC}
      onFetchError={handleKabalFetchError}
      errorComponent={KabalErrorActions}
      theme={appTheme}
    />
  );
};

// ---------- error handling with toast + auth redirect ----------

const handleKabalFetchError = ({ status, body }: FetchErrorInfo): void => {
  if (status === 401) {
    toast.error(<ErrorToast error="Ikke innlogget" />);

    if (ENVIRONMENT.isDeployed) {
      window.location.assign('/oauth2/login');
    }

    return;
  }

  const contentType = parseJSON(body);

  if (contentType !== null && isKabalApiErrorData(contentType)) {
    toast.error(<ErrorToast error={contentType} />);

    return;
  }

  const errorMessage = body.length > 0 ? body : `Ukjent feil (${status.toString(10)})`;
  toast.error(<ErrorToast error={errorMessage} />);
};

const ErrorToast = ({ error }: { error: string | KabalApiErrorData }) => (
  <VStack>
    <Heading size="xsmall" level="1" spacing>
      Feil ved henting av fil
    </Heading>

    <BodyShort size="small" spacing>
      Ta kontakt med Team Klage på Teams.
    </BodyShort>

    {isKabalApiErrorData(error) ? (
      <>
        <Section heading="Tittel">{error.title}</Section>
        <Section heading="Statuskode">{error.status}</Section>
        <Section heading="Detaljer">{error.detail}</Section>
      </>
    ) : (
      <Section heading="Detaljer">{error}</Section>
    )}
  </VStack>
);

// ---------- "fix PDF" error action ----------

const KabalErrorActions = ({ refresh }: { refresh: () => void }) => {
  const [fixPdf, isFixing] = useFixPdf(refresh);

  return (
    <BodyShort>
      Hvis dette er et brev som er skrevet i Kabal kan det hende det hjelper å{' '}
      <Button size="small" variant="primary" onClick={fixPdf} loading={isFixing}>
        Åpne brevutformingen på nytt
      </Button>
      .
    </BodyShort>
  );
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useFixPdf = (refresh: () => void): [() => Promise<void>, boolean] => {
  const { setValue } = useSmartEditorEnabled();
  const [isLoading, setIsLoading] = useState(false);

  return [
    async () => {
      setIsLoading(true);
      setValue(false);
      await wait(200);
      setValue(true);
      await wait(5000);
      refresh();
      setIsLoading(false);
    },
    isLoading,
  ];
};
