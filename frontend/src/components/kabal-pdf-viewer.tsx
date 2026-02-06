import { AppTheme, useAppTheme } from '@app/app-theme';
import { toast } from '@app/components/toast/store';
import { Section } from '@app/components/toast/toast-content/api-error-toast';
import { ENVIRONMENT } from '@app/environment';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { isKabalApiErrorData, type KabalApiErrorData } from '@app/types/errors';
import { BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import {
  type FetchErrorInfo,
  KlagePdfViewer as KlagePdfViewerComponent,
  type KlagePdfViewerProps,
  type PdfViewerConfig,
} from '@navikt/klage-pdf-viewer';
// @ts-expect-error — Vite `?url` import: returns the resolved public URL as a string.
import WORKER_SRC from '@navikt/klage-pdf-viewer/pdf-worker?url';
import { useMemo, useState } from 'react';

export type { KlagePdfViewerProps } from '@navikt/klage-pdf-viewer';

export const KabalPdfViewer = ({
  config,
  documentSetUrl: _documentSetUrl,
  ...props
}: Omit<KlagePdfViewerProps, 'workerSrc'> & { workerSrc?: string; documentSetUrl?: string | null }) => {
  const appTheme = useAppTheme();

  const kabalConfig = useMemo<Partial<PdfViewerConfig>>(
    () => ({
      invertColors: appTheme === AppTheme.DARK,
      onFetchError: handleKabalFetchError,
      ErrorActions: KabalErrorActions,
      ...config,
    }),
    [appTheme, config],
  );

  return <KlagePdfViewerComponent workerSrc={WORKER_SRC} {...props} config={kabalConfig} />;
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

  const contentType = tryParseJson(body);

  if (contentType !== null && isKabalApiErrorData(contentType)) {
    toast.error(<ErrorToast error={contentType} />);

    return;
  }

  const errorMessage = body.length > 0 ? body : `Ukjent feil (${status.toString(10)})`;
  toast.error(<ErrorToast error={errorMessage} />);
};

const tryParseJson = (text: string): unknown => {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

const ErrorToast = ({ error }: { error: string | KabalApiErrorData }) => (
  <VStack>
    <Heading size="xsmall" level="1" spacing>
      Feil ved henting av PDF
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
