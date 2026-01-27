import { useAppTheme } from '@app/app-theme';
import { toast } from '@app/components/toast/store';
import { Section } from '@app/components/toast/toast-content/api-error-toast';
import { ENVIRONMENT } from '@app/environment';
import { isNotNullOrUndefined } from '@app/functions/is-not-type-guards';
import { parseJSON } from '@app/functions/parse-json';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorEnabled } from '@app/hooks/settings/use-setting';
import { isKabalApiErrorData, type KabalApiErrorData } from '@app/types/errors';
import { BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { type FetchErrorInfo, KlageFileViewer, type KlageFileViewerProps } from '@navikt/klage-file-viewer';
// @ts-expect-error — Vite `?url` import: returns the resolved public URL as a string.
import WORKER_SRC from '@navikt/klage-file-viewer/pdf-worker?url';
import { useMemo, useState } from 'react';

export type { FileEntry, KlageFileViewerProps } from '@navikt/klage-file-viewer';

export const KabalFileViewer = ({
  files,
  onClose,
  newTabUrl,
}: Pick<KlageFileViewerProps, 'files' | 'onClose' | 'newTabUrl'>) => {
  const appTheme = useAppTheme();
  const { data: oppgave } = useOppgave();

  const sakenGjelder = oppgave?.sakenGjelder;
  const klager = oppgave?.klager;
  const prosessfullmektig = oppgave?.prosessfullmektig;

  const commonPasswords = useMemo(
    () => [
      ...new Set(
        [sakenGjelder?.identifikator, klager?.identifikator, prosessfullmektig?.identifikator].filter(
          isNotNullOrUndefined,
        ),
      ),
    ],
    [sakenGjelder, klager, prosessfullmektig],
  );

  return (
    <KlageFileViewer
      files={files}
      onClose={onClose}
      newTabUrl={newTabUrl}
      workerSrc={WORKER_SRC}
      onFetchError={handleKabalFetchError}
      errorComponent={KabalErrorActions}
      theme={appTheme}
      commonPasswords={commonPasswords}
    />
  );
};

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

const KabalErrorActions = ({ refresh }: { refresh: () => void }) => {
  const [fixPdf, isFixing] = useFixFile(refresh);

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

const useFixFile = (refresh: () => void): [() => Promise<void>, boolean] => {
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
